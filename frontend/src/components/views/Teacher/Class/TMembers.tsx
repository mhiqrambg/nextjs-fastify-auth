import { TClassroomMember } from "@/types/Classroom";
import { Avatar, Button, Card, CardBody, Skeleton } from "@heroui/react";

const TMembers = ({
  isMembersLoading,
  isMembersFetching,
  members,
}: {
  isMembersLoading: boolean;
  isMembersFetching: boolean;
  members: TClassroomMember[];
}) => {
  return (
    <Card className="shadow-sm">
      <CardBody>
        {isMembersLoading || isMembersFetching ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
            ))}
          </div>
        ) : members && members.length > 0 ? (
          <div className="flex flex-col gap-2">
            {members.map((member: TClassroomMember) => (
              <div
                key={member.member_id}
                className="border-default-200 flex items-center justify-between gap-2 rounded-xl border p-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    isBordered
                    size="md"
                    name={member.member_name}
                    src={member.member_image_url ?? undefined}
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium capitalize">
                      {member.member_name}
                    </span>
                    <span className="text-default-500 text-xs">
                      {member.member_email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="bordered">
                    Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-default-500">No members found for this class.</p>
        )}
      </CardBody>
    </Card>
  );
};

export default TMembers;
