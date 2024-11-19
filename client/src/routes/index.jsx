import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import ResetPassword from "../pages/ResetPassword";
import VerifyOtp from "../pages/VerifyOtp";
import VerifyEmail from "../pages/VerifyEmail";
import RegisterVerify from "../pages/RegisterVerify";


const router = createBrowserRouter([
    {
    path : "/",
    element : <App/>,
    children : [
        {
            path : "register",
            element : <AuthLayouts><RegisterPage/></AuthLayouts>
        },
        {
            
            path : "register-verify",
            element: <AuthLayouts>
                            <RegisterVerify />
                    </AuthLayouts>
        },
        {
            path : 'email',
            element : <AuthLayouts><CheckEmailPage/></AuthLayouts>
        },
        {
            path : 'password',
            element : <AuthLayouts><CheckPasswordPage/></AuthLayouts>
        },
        {
            path : 'verify-email',
            element : <AuthLayouts><VerifyEmail/></AuthLayouts>
        },
        {
            path : "verify-otp",
            element: <AuthLayouts>
                    <VerifyOtp />
            </AuthLayouts>
        },
        {
            path : 'reset-password',
            element: <AuthLayouts>
                    <ResetPassword />
            </AuthLayouts>
        },
        {
            path : "",
            element : <Home/>,
            children : [
                {
                    path : ':userId',
                    element : <MessagePage/>
                }
            ]
        }
    ]
    },
])

export default router