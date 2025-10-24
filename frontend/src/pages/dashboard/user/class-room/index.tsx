import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Class } from "@/components/views/user/Class";
import InputCode from "@/components/ui/InputCode";

const ClassRoom = () => {
  return (
    <DashboardLayout title="Class Room" type="user" isOpen={false}>
      <InputCode
        title="Join Class"
        description="You have a class code. Please enter it to join the class."
        buttonText="Join"
        buttonInputText="Input Class Code"
        placeholder="Enter class code"
      />
      <Class />
    </DashboardLayout>
  );
};

export default ClassRoom;
