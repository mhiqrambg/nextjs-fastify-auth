import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Exam } from "@/components/views/user/Exam";
import InputCode from "@/components/ui/InputCode";

const MyExam = () => {
  return (
    <DashboardLayout title="My Exam" type="user" isOpen={false}>
      <InputCode
        title="Join Exam"
        description="You have a exam code. Please enter it to join the exam."
        buttonText="Join"
        buttonInputText="Input Exam Code"
        placeholder="Enter exam code"
      />
      <Exam />
    </DashboardLayout>
  );
};

export default MyExam;
