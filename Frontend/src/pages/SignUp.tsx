import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle, User, Mail, Lock, } from "lucide-react";
import { Toaster, toast } from "sonner";
import axios from "axios";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role:""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function apicall() {
    setIsLoading(true);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please ensure both passwords are identical",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Match the exact field names expected by the backend
      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role:formData.role
        // Note: role is not being sent from the frontend but is expected in the backend
        // You might want to add a default role or add role selection to your form
      });
      
      // The backend returns token and user object on success
      if (response.data.token && response.data.user) {
        toast.success("Account created!", {
          description: "You've successfully signed up.",
        });
        
        // Store the token in localStorage for authentication
        localStorage.setItem('token', response.data.token);
        
        // Redirect to login or dashboard
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error("Account creation failed!", {
          description: "Unexpected response from server.",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // The backend returns specific error messages
        const errorMessage = error.response.data.message || "An error occurred during signup.";
        toast.error("Account creation failed!", {
          description: errorMessage,
        });
        console.error("Signup error details:", error.response.data);
      } else {
        toast.error("Account creation failed!", {
          description: "Network error or server is unavailable.",
        });
        console.error("Signup error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Sonner Toaster component */}
      <Toaster position="top-center" richColors />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-xl overflow-hidden">
          <motion.div
            className="h-2 bg-gradient-to-r from-blue-400 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
          <CardHeader className="space-y-1 pb-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
              <CardDescription className="text-center pt-2">
                Join Quality CheckList to manage your tasks efficiently
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <Label htmlFor="Role">Role</Label>
              <div>
                 {/*Some iconss*/}
                 <Input id="role" name="role" placeholder="Role" className="pl-10" value={formData.role} onChange={handleChange} />
              </div>
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-full"
            >
              <Button 
                onClick={apicall} 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-center text-sm text-gray-500"
            >
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Log in
              </a>
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
