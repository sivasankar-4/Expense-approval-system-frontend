import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  return (

    <div className="w-full max-w-md">

     <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center jusitfy-center rounded-full border-2 border-black">
         Logo
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Expense Approval System</h1>

         <p className="mt-2 text-sm text-gray-500">
          Secure Enterprise Expense Management
        </p>

     </div>

     <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>

          <CardDescription>
            Access your enterprise workspace
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-5">
            <div>

              <label className="mb-2 block text-sm font-medium">Email</label>
              <Input  type="email" placeholder="Enter your email"/>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
               Password
              </label>

              <Input type="password" placeholder="Enter your password"/>
              
            </div>

            <Button className="w-full">Sign In</Button>

          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-black"
          >
            Forgot Password?
          </button>
        </CardFooter>

        </Card>

   </div>

  );
};

export default LoginPage;