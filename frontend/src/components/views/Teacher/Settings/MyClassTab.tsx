import { Card, CardBody, CardHeader, Spinner } from "@heroui/react";

export default function MyClassTab({ isFetching }: { isFetching: boolean }) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="text-lg font-semibold">My Class</div>
        {isFetching ? <Spinner size="sm" /> : null}
      </CardHeader>
      <CardBody>
        <p>My Class</p>
      </CardBody>
    </Card>
  );
}
