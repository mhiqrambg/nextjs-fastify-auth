import {
  Breadcrumbs as BreadcrumbsComponent,
  BreadcrumbItem,
} from "@heroui/breadcrumbs";

export const Breadcrumbs = ({
  breadcrumbs,
}: {
  breadcrumbs: { label: string; href: string }[];
}) => {
  return (
    <div>
      <BreadcrumbsComponent>
        {breadcrumbs.map((breadcrumb) => (
          <BreadcrumbItem key={breadcrumb.href} href={breadcrumb.href}>
            {breadcrumb.label}
          </BreadcrumbItem>
        ))}
      </BreadcrumbsComponent>
    </div>
  );
};
