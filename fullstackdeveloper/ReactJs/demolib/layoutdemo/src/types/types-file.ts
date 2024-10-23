export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LayoutProps extends BaseProps {
  // Add any specific layout props here
}

export interface FeatureProps extends BaseProps {
  title: string;
}

export interface ColumnProps extends BaseProps {
  title: string;
  content: string;
  featuredItem?: {
    title: string;
    description: string;
  };
}

export interface NavigationItem {
  path: string;
  label: string;
  children?: NavigationItem[];
}
