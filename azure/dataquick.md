# End-to-End Azure Data Architecture – Tutorial, Outline & Examples

A pragmatic, production‑minded guide to design and implement a modern data platform on Azure using **Azure Data Lake Storage Gen2 (ADLS)**, **Azure Data Factory (ADF)**, **Azure Databricks (Delta Lake)**, **Azure Synapse Analytics (serverless/dedicated)**, and **Azure SQL**. Includes sample IaC, pipelines, notebooks, T‑SQL, security/governance, CI/CD, and monitoring.

---

## 0) Who this is for & prerequisites
- Architects/Leads designing enterprise data platforms; hands‑on Engineers delivering pipelines & models.
- You should be comfortable with: Azure basics, Git, Python or Scala, SQL, JSON/YAML.
- CLI: Azure CLI, Databricks CLI. Optional: Terraform or Bicep.

> **Scenario**: Build a platform that ingests CRM (REST), ERP (SQL), and CSV files (S3/Blob), lands raw in the **Bronze** zone, transforms/cleanses to **Silver**, models **Gold** marts (star schema) for BI and Data Science, and serves via Synapse serverless or Azure SQL. Security baseline must support PII/PHI (HIPAA‑ready patterns), private networking, and governance/lineage.

---

## 1) Reference Architecture (Medallion + Orchestration)

```mermaid
flowchart LR
    subgraph Source Systems
      A[CRM REST API] --- B[ERP Azure SQL]
      C[CSV on Blob/S3]
    end

    subgraph Ingestion/Orchestration
      D[Azure Data Factory\n(Managed VNET + MI)]
    end

    subgraph Storage (ADLS Gen2)
      E[Bronze\nraw/] --> F[Silver\ncurated/]
      F --> G[Gold\npresent/]
    end

    subgraph Compute/Transform
      H[Azure Databricks\nDelta Lake] --> F
      H --> G
    end

    subgraph Serving
      I[Synapse Serverless SQL\nExternal Tables/Views]
      J[Azure SQL DB\nGold Marts]
    end

    subgraph Governance/Sec
      K[Microsoft Purview]
      L[Azure Key Vault]
      M[Private Link + RBAC/ACL]
    end

A --> D
B --> D
C --> D
D --> E
I <-->|Query over ADLS| E
I <-->|Query over ADLS| F
I <-->|Query over ADLS| G
G --> J
K -.-> E
K -.-> I
L -.-> D
L -.-> H
M -.-> D
M -.-> H
M -.-> I
M -.-> J
```

**Zones**
- **Bronze**: immutable raw, partitioned by source/date; schema‑on‑read.
- **Silver**: cleansed/standardized Delta tables; schema‑on‑write; CDC/watermarks handled.
- **Gold**: star schema marts; KPI‑ready aggregates; RLS/column masking where needed.

---

## 2) Naming & Folder Structure (ADLS Gen2)
```
/adls-data-lake
  /raw/erp/sales/ingest_dt=2025-08-01/*.parquet
  /raw/crm/opportunities/ingest_dt=2025-08-01/*.json
  /raw/files/vendorX/ingest_dt=2025-08-01/*.csv
  /curated/sales/silver/...
  /present/sales/gold/...
  /_checkpoints/...
  /_audit/...
```
- **Partitioning**: `ingest_dt=YYYY-MM-DD`, optionally `country=US/region=centralus`.
- **Security**: Use **ABAC (container‑level)** + **POSIX ACLs** for granular access; data owners per zone.

---

## 3) Infrastructure as Code (Bicep – minimal, production‑minded)
> Deploys Resource Group, ADLS Gen2, Key Vault, ADF (Managed VNET), Databricks workspace, Synapse workspace, Azure SQL Server+DB, Private DNS/Links hooks (stubs). Parameterize for real use.

```bicep
param location string = resourceGroup().location
param prefix string = 'zactonics'
param sqlAdminLogin string
@secure()
param sqlAdminPwd string

resource sa 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: '${prefix}adls'
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    isHnsEnabled: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
  }
}

resource kv 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: '${prefix}-kv'
  location: location
  properties: {
    sku: { family: 'A'; name: 'standard' }
    enableSoftDelete: true
    enablePurgeProtection: true
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
  }
}

resource adf 'Microsoft.DataFactory/factories@2018-06-01' = {
  name: '${prefix}-adf'
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {
    publicNetworkAccess: 'Disabled'
    repoConfiguration: null
  }
}

resource dbr 'Microsoft.Databricks/workspaces@2024-05-01' = {
  name: '${prefix}-dbr'
  location: location
  sku: { name: 'standard' }
  properties: {
    parameters: {
      enableNoPublicIp: { value: 'true' }
    }
  }
}

resource syn 'Microsoft.Synapse/workspaces@2021-06-01' = {
  name: '${prefix}-syn'
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {
    defaultDataLakeStorage: {
      accountUrl: 'https://${sa.name}.dfs.core.windows.net'
      filesystem: 'datalake'
    }
    managedVirtualNetwork: 'default'
    publicNetworkAccess: 'Disabled'
  }
}

resource sql 'Microsoft.Sql/servers@2021-11-01' = {
  name: '${prefix}-sql'
  location: location
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPwd
    publicNetworkAccess: 'Disabled'
  }
}

resource sqldb 'Microsoft.Sql/servers/databases@2021-11-01' = {
  name: '${sql.name}/${prefix}gold'
  location: location
  sku: { name: 'GP_S_Gen5_2' } // adjust size/tiers
}
```

> Tip: Add **Private Endpoints** (Blob/DFS, ADF, Synapse, SQL), **Private DNS Zones**, and **Firewall** rules for complete isolation. Store secrets (API keys, SQL creds) in **Key Vault**; reference via **Managed Identity**.

---

## 4) Ingestion with Azure Data Factory (ADF)
### 4.1 Linked Services (concepts)
- **Key Vault** linked service for secrets.
- **HTTP** (CRM API) → **ADLS** (Copy Activity).
- **Azure SQL** (ERP) via Managed Identity/Key.
- Integration Runtime: Managed VNET; Self‑Hosted IR if on‑prem.

### 4.2 Example: Copy REST → ADLS (JSON to Parquet)
```json
{
  "name": "pl_crm_opportunities_to_bronze",
  "properties": {
    "activities": [
      {
        "name": "CopyCRM",
        "type": "Copy",
        "typeProperties": {
          "source": { "type": "RestSource" },
          "sink": {
            "type": "DelimitedTextSink",
            "storeSettings": { "type": "AzureBlobFSWriteSettings" }
          },
          "enableStaging": false
        },
        "inputs": [ { "referenceName": "ds_crm_rest", "type": "DatasetReference" } ],
        "outputs": [ { "referenceName": "ds_bronze_crm", "type": "DatasetReference" } ]
      }
    ],
    "annotations": ["bronze","crm"],
    "runtimeConfiguration": { "timeout": "01:00:00" }
  }
}
```

**Destination path pattern** (dataset): `raw/crm/opportunities/ingest_dt=@{formatDateTime(utcNow(),'yyyy-MM-dd')}/`.

### 4.3 Example: Incremental SQL → ADLS with Watermark
- Maintain watermark table (last successful load timestamp).
- Use dynamic query in Copy Activity: `WHERE ModifiedDate > @{activity('GetWatermark').output.firstRow.last_ts}`.

**Sample T‑SQL for watermark table**
```sql
CREATE TABLE etl.Watermark (
  SourceName sysname PRIMARY KEY,
  LastTS     datetime2 NOT NULL
);
INSERT INTO etl.Watermark VALUES ('ERP_Sales', '2000-01-01');
```

---

## 5) Transform with Databricks (Delta Lake, PySpark)
### 5.1 Cluster/compute
- Use **jobs/compute** with **no public IP**; enable **Unity Catalog** when available for centralized governance.
- Mount ADLS Gen2 with **ABFS** (recommended) rather than DBFS mounts.

### 5.2 Bronze → Silver (schema, dedupe, DQ)
```python
from pyspark.sql import functions as F, types as T

raw = (
  spark.read.json("abfss://datalake@<storage>.dfs.core.windows.net/raw/crm/opportunities/ingest_dt=2025-08-01/")
)

# Example explicit schema (better than inferSchema in prod)
schema = T.StructType([
  T.StructField("id", T.StringType()),
  T.StructField("account_id", T.StringType()),
  T.StructField("stage", T.StringType()),
  T.StructField("amount", T.DoubleType()),
  T.StructField("updated_at", T.TimestampType()),
])

raw = spark.read.schema(schema).json("abfss://datalake@<storage>.dfs.core.windows.net/raw/crm/opportunities/*")

silver = (
  raw
  .dropDuplicates(["id"])  # simple de-dupe
  .withColumn("load_dt", F.current_date())
  .filter(F.col("id").isNotNull())
)

(silver
  .write.format("delta")
  .mode("overwrite")
  .option("overwriteSchema", "true")
  .save("abfss://datalake@<storage>.dfs.core.windows.net/curated/crm/opportunities"))
```

### 5.3 Silver → Gold (star schema & aggregates)
```python
opps = spark.read.format("delta").load("abfss://datalake@<storage>.dfs.core.windows.net/curated/crm/opportunities")
accounts = spark.read.format("delta").load("abfss://datalake@<storage>.dfs.core.windows.net/curated/crm/accounts")

fact = (
  opps.alias("o")
  .join(accounts.alias("a"), F.col("o.account_id")==F.col("a.id"), "left")
  .select(
    F.col("o.id").alias("opportunity_key"),
    F.col("a.id").alias("account_key"),
    "o.stage","o.amount","o.updated_at"
  )
)

(fact.write.format("delta").mode("overwrite")
 .save("abfss://datalake@<storage>.dfs.core.windows.net/present/crm/fact_opportunity"))
```

> **Data Quality**: integrate **Great Expectations** or expectations in Delta Live Tables; fail/alert on schema drift, nulls in business keys, negative amounts, etc.

---

## 6) Serving with Synapse Serverless & Azure SQL

### 6.1 Synapse Serverless – external objects over Delta/Parquet
```sql
-- Data source and format
CREATE EXTERNAL DATA SOURCE ds_adls
WITH ( LOCATION = 'abfss://datalake@<storage>.dfs.core.windows.net' );

CREATE EXTERNAL FILE FORMAT ParquetFF
WITH ( FORMAT_TYPE = PARQUET );

-- View using OPENROWSET over Gold Delta (Parquet manifests when applicable)
CREATE OR ALTER VIEW dbo.vw_FactOpportunity AS
SELECT *
FROM OPENROWSET(
    BULK 'present/crm/fact_opportunity/',
    DATA_SOURCE = 'ds_adls',
    FORMAT = 'PARQUET'
) AS rows;
```

### 6.2 Azure SQL – curated mart (RLS/Masking friendly)
```sql
CREATE SCHEMA crm;

CREATE TABLE crm.DimAccount (
  AccountKey      INT IDENTITY PRIMARY KEY,
  AccountId       NVARCHAR(50) UNIQUE,
  AccountName     NVARCHAR(200),
  Region          NVARCHAR(50)
);

CREATE TABLE crm.FactOpportunity (
  OpportunityKey  INT IDENTITY PRIMARY KEY,
  OpportunityId   NVARCHAR(50) UNIQUE,
  AccountKey      INT NOT NULL FOREIGN KEY REFERENCES crm.DimAccount(AccountKey),
  Stage           NVARCHAR(50),
  Amount          DECIMAL(18,2),
  UpdatedAt       DATETIME2(3),
  LoadDt          DATE
);

-- Example RLS predicate (by Region)
CREATE SCHEMA sec;
CREATE FUNCTION sec.fnRLS_Region(@Region AS NVARCHAR(50)) RETURNS TABLE
AS RETURN SELECT 1 AS fn_access WHERE @Region = CAST(SESSION_CONTEXT(N'Region') AS NVARCHAR(50));

CREATE SECURITY POLICY sec.Policy ADD FILTER PREDICATE sec.fnRLS_Region(Region) ON crm.DimAccount;
```

> **Power BI** connects directly to Synapse serverless for exploratory queries; publish certified datasets from Azure SQL for governed BI.

---

## 7) Modeling Patterns (Star, Data Vault, Lakehouse)
- **Gold = Star Schema** for BI (facts/dimensions, conformed dimensions).
- **Silver = 3NF-ish** standardized entities; low cardinality codes normalized.
- **Data Vault** optional in Silver for complex historization.
- **Lakehouse**: Delta format + Unity Catalog (or Hive metastore) for table management and ACID.

---

## 8) Orchestration, Incrementals & CDC
- **Triggers**: ADF schedule/event triggers for each pipeline; dependency chain for Bronze→Silver→Gold.
- **Watermark** per source; store ETL metadata (rows, hash, checksum) in an audit Delta table.
- **CDC**: If ERP SQL has CDC/CT enabled, capture `__$operation` and apply MERGE into Silver.

**PySpark MERGE upsert**
```python
from delta.tables import DeltaTable

silver_path = "abfss://datalake@<storage>.dfs.core.windows.net/curated/erp/sales"
updates = spark.read.parquet("abfss://datalake@<storage>.dfs.core.windows.net/raw/erp/sales/*")

DeltaTable.forPath(spark, silver_path).alias("t") \
  .merge(updates.alias("s"), "t.id = s.id") \
  .whenMatchedUpdateAll() \
  .whenNotMatchedInsertAll() \
  .execute()
```

---

## 9) Security & Governance (HIPAA‑ready patterns)
- **Isolation**: Private Endpoints for Storage/ADF/Synapse/SQL + Private DNS; disable public network access.
- **Identity**: Managed Identities for ADF/Databricks/Synapse; RBAC on resources; POSIX ACLs on ADLS folders.
- **Secrets**: Key Vault for connection strings, API tokens; rotate regularly; enable purge protection.
- **Encryption**: At‑rest (platform) + optional **CMK/BYOK** via Key Vault; in‑transit TLS 1.2+.
- **Data Protection**: Dynamic Data Masking, TDE, RLS; classify/sensitive labels via **Microsoft Purview**; DLP policies.
- **Audit**: Centralize logs to **Log Analytics**; retain ≥ 1 year for regulated workloads.

---

## 10) CI/CD (Azure DevOps or GitHub Actions)
- **Repos**: mono‑repo or per‑layer (`infra/`, `adf/`, `dbr/`, `sql/`).
- **Artifacts**: Bicep/Terraform for infra; ADF ARM template or `adf_publish` branch; Databricks notebooks/jobs (DABs or `databricks bundle`); SQL migration scripts.
- **Environments**: `dev` → `test` → `prod` with parameterized names, SKUs, secrets.

**GitHub Actions – deploy Bicep + ADF**
```yaml
name: deploy-data-platform
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - name: Deploy Bicep
        uses: azure/arm-deploy@v2
        with:
          scope: subscription
          region: eastus
          template: infra/main.bicep
          parameters: infra/params/dev.json
      - name: Publish ADF
        run: |
          az datafactory pipeline create \
            --resource-group rg-data \
            --factory-name zactonics-adf \
            --name pl_crm_opportunities_to_bronze \
            --pipeline @adf/pipelines/pl_crm_opportunities_to_bronze.json
```

**Databricks CLI – deploy job**
```bash
databricks jobs create --json @dbr/jobs/bronze_to_silver.json
```

---

## 11) Monitoring & Observability
- **ADF**: pipeline run dashboards; alerts on fail; push logs to Log Analytics; set retry policies.
- **Databricks**: enable cluster, driver/executor logs to storage; jobs API for status; Delta table `operationMetrics`.
- **Synapse/SQL**: Query Store, workload classifiers; serverless DMV for external query metrics.
- **End‑to‑end lineage**: Purview scans (ADLS, ADF, Synapse, SQL, Power BI); link lineage to owners.

**Simple audit schema (Delta)**
```python
metrics = spark.createDataFrame([
  ("pl_crm_opportunities_to_bronze", 15234, "2025-08-29T01:02:03Z", "Succeeded")
], ["pipeline","rows","ts","status"])
metrics.write.mode("append").format("delta").save("abfss://datalake@<storage>.dfs.core.windows.net/_audit/pipeline_metrics")
```

---

## 12) Cost Management
- Use **serverless SQL** for bursty/adhoc; scale down dedicated pools off‑hours.
- Use **Delta Z‑Order** and **Optimize** for read performance; compact small files.
- Right‑size Databricks clusters; consider **spot** nodes for dev.
- Lifecycle policies to tier cold data to **Cool/Archive**.

---

## 13) DR/HA & Compliance
- **Storage**: GRS/RA‑GRS; soft delete; versioning.
- **SQL**: Geo‑replication; automated backups/long‑term retention.
- **Synapse**: Restore points; infra as code for quick redeploy.
- **Runbooks**: ADF export/import; Databricks job export; key rotation procedures.

---

## 14) End‑to‑End Walkthrough (Hands‑On Lab)
1. **Deploy** minimal infra (Bicep above); create `datalake` filesystem in ADLS.
2. **Create** ADF linked services (Key Vault, HTTP, ADLS; optionally Azure SQL source) and datasets.
3. **Build** `pl_crm_opportunities_to_bronze` copy pipeline; add daily trigger.
4. **Author** Databricks notebook to read Bronze → write Silver/Gold (Delta) as shown.
5. **Publish** Synapse serverless external data source; create view on Gold.
6. **Model** a small star in Azure SQL; enable sample RLS policy.
7. **Validate** with a Power BI desktop file connecting to Synapse view & Azure SQL mart.
8. **Secure** with Private Endpoints; test access with/without VNET; enforce RBAC/ACLs.
9. **Automate** with a GitHub Action to deploy infra and promote ADF pipelines.
10. **Monitor** runs, collect audit metrics, and surface a workbook dashboard.

---

## 15) Role‑Aligned Responsibilities (Lead the Platform)
- **Architecture**: reference architecture, zone ownership, SLAs/SLOs, capacity/throughput planning.
- **Security**: threat model, access model, private networking, secrets, compliance mapping (HIPAA/SOC2).
- **Data Modeling**: conformed dimensions, SCD strategy, naming/versioning conventions.
- **Delivery**: backlog of sources, ingestion contracts, DQ SLAs, CDC patterns, data product ownership.
- **Ops**: observability SLOs, cost guardrails, runbooks, RTO/RPO, DR testing.

---

## 16) Checklists
**Design Checklist**
- [ ] Source inventory & contracts (schemas, SLAs, cadence, auth)
- [ ] Medallion zone design & retention
- [ ] CDC/watermark strategy per source
- [ ] Security model: network, identity, secrets, RLS/masking
- [ ] Governance: Purview scans, glossary, lineage
- [ ] Serving: serverless vs dedicated vs Azure SQL

**Implementation Checklist**
- [ ] IaC deployed (Storage, KV, ADF, Databricks, Synapse, SQL)
- [ ] Linked services & datasets parameterized
- [ ] Pipelines with retries, alerts, idempotency
- [ ] Delta tables with expectations & compaction
- [ ] Synapse external objects created
- [ ] CI/CD wired, environment params, approvals
- [ ] Monitoring dashboards & runbooks live

---

## 17) Appendix – More Snippets
**ADF dataset path expression**
```json
"folderPath": "raw/@{pipeline().parameters.source}/@{pipeline().parameters.entity}/ingest_dt=@{formatDateTime(utcNow(),'yyyy-MM-dd')}"
```

**Synapse serverless – ad‑hoc OPENROWSET**
```sql
SELECT TOP 100 *
FROM OPENROWSET(BULK 'raw/files/vendorX/ingest_dt=2025-08-01/*.csv',
                DATA_SOURCE='ds_adls',
                FORMAT='CSV', PARSER_VERSION='2.0', FIRSTROW=2)
WITH (
  Col1 varchar(100), Col2 int, Col3 datetime2
) AS r;
```

**Azure SQL – SCD Type 2 template**
```sql
CREATE TABLE crm.DimCustomer (
  CustomerKey INT IDENTITY PRIMARY KEY,
  CustomerId  NVARCHAR(50),
  Name        NVARCHAR(200),
  Region      NVARCHAR(50),
  ValidFrom   DATETIME2 NOT NULL,
  ValidTo     DATETIME2 NULL,
  IsCurrent   BIT NOT NULL DEFAULT 1
);
```

**Databricks – Auto‑optimize/Compact**
```sql
OPTIMIZE delta.`abfss://datalake@<storage>.dfs.core.windows.net/curated/crm/opportunities` ZORDER BY (account_id);
VACUUM delta.`abfss://datalake@<storage>.dfs.core.windows.net/curated/crm/opportunities` RETAIN 168 HOURS;
```

---

### Where to go next
- Swap Bicep for Terraform, or add **Azure DevOps** multi‑stage YAML.
- Add **Delta Live Tables** or **Fabric** pipelines if your org standardizes there.
- Introduce **Data Science** paths (MLflow, Feature Store) on Silver/Gold.
- Build a **security workbook** and **cost workbook** to keep stakeholders aligned.

