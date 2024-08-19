# EC2 Pricing Options Summary

## Pricing Models

- On-Demand
  - Pay by hour or second
  - No upfront cost or long-term commitment
  - Best for short-term, spiky, or unpredictable workloads
  - Good for testing new applications

- Reserved Instances (RI)
  - Reserve capacity for 1 or 3 years
  - Up to 72% discount on hourly charge
  - Operates at a regional level
  - Best for applications with steady state or predictable usage
  - Three types:
    1. Standard RI: Set quantity and instance type, up to 72% discount
    2. Convertible RI: Option to change instance type, up to 54% discount
    3. Scheduled RI: Launch within specified time frames

- Spot Instances
  - Purchase unused capacity at up to 90% discount
  - Price fluctuates with supply and demand
  - Instance can be terminated or hibernated if price exceeds your maximum
  - Best for applications with flexible start/end times or urgent need for large compute capacity

- Dedicated Hosts
  - Physical EC2 server for your exclusive use
  - Most expensive option
  - Best for compliance requirements or software licenses tied to physical hardware

## Additional Pricing Options

- Savings Plans
  - Save up to 72% on AWS compute usage
  - Commit to 1 or 3 years of specific compute power usage
  - Flexible across instance types, regions, and services (includes Lambda and Fargate)

## Best Practices

- Use AWS Pricing Calculator to estimate costs
- Remember to terminate or stop instances when not in use to avoid unnecessary costs

## Exam Tips

- Understand the use cases for each pricing model
- Know the benefits and limitations of each option
- Be familiar with the discounts offered by different models
