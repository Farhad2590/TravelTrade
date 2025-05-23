import { createBrowserRouter } from "react-router-dom";

import Main from "../Layout/Main";
import SignIn from "../Pages/Signin";

import Dashboard from "../Layout/Dashboard";
import SignUpFlow from "../Components/SharedComponets/SignUpFlow";

import Home from "../Pages/SharedPages/Home/Home";
import FindTravelers from "../Pages/SharedPages/FindTavellers/FindTravelers";
import HowItWorks from "../Pages/SharedPages/Home/components/HowItWorks";
import PostDetails from "../Pages/SharedPages/FindTavellers/components/PostDetails";
import PostNewTrip from "../Pages/TravellerPages/PostNewTrip";
import UserManagement from "../Pages/AdminPages/UserManagement";
import MyTripPosts from "../Pages/TravellerPages/MyTripPosts/MyTripPosts";
import SeeTravellerPost from "../Pages/AdminPages/SeeTravellerPost/SeeTravellerPost";
import RequestedBids from "../Pages/TravellerPages/RequestedBids/RequestedBids";
import MyBids from "../Pages/SenderPages/MyBids/MyBids";
import VerificationRequest from "../Pages/AdminPages/VerificationRequest";
import Profile from "../Pages/SharedPages/Profile/Profile";
import RequestPage from "../Pages/SharedPages/FindTavellers/components/RequestPage";
import PaymentHistory from "../Pages/SenderPages/PaymentHistory/PaymentHistory";
import Earnings from "../Pages/TravellerPages/Earnings/Earnings";
import Payments from "../Pages/AdminPages/Payments/Payments";
import Withdrawals from "../Pages/AdminPages/Withdrawals/Withdrawals";
import Unauthorized from "../Pages/SharedPages/Unauthorized/Unauthorized";
import AdminRoute from "./AdminRoute";
import TravelerRoute from "./TravelerRoute";
import SenderRoute from "./SenderRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/findTravelers",
        element: <FindTravelers />,
      },
      {
        path: "/howItWorks",
        element: <HowItWorks />,
      },
      {
        path: "/findTravelers/:id",
        element: <PostDetails />,
      },
      {
        path: "/postTravelPlans",
        element: <PostNewTrip />,
      },
      {
        path: "/post/:id/request/:type",
        element: <RequestPage />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      //Shared
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },
      //Admin
      {
        path: "/dashboard/manage-users",
        element: <AdminRoute><UserManagement /></AdminRoute>,
      },
      {
        path: "/dashboard/post-review",
        element: <SeeTravellerPost />,
      },
      {
        path: "/dashboard/verification-request",
        element: <VerificationRequest />,
      },
      {
        path: "/dashboard/transactions",
        element: <Payments />,
      },
      {
        path: "/dashboard/disputes",
        element: <Withdrawals />,
      },

      //traveller
      {
        path: "/dashboard/post-trip",
        element: <TravelerRoute><PostNewTrip /></TravelerRoute>,
      },
      {
        path: "/dashboard/my-trips",
        element: <MyTripPosts />,
      },
      {
        path: "/dashboard/available-requests",
        element: <RequestedBids />,
      },
      {
        path: "/dashboard/earnings",
        element: <Earnings />,
      },
      //Sender
      {
        path: "/dashboard/my-bids",
        element: <SenderRoute><MyBids /></SenderRoute>,
      },
      {
        path: "/dashboard/find-travelers",
        element: <FindTravelers />,
      },
      {
        path: "/dashboard/payments",
        element: <PaymentHistory />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signUpFlow",
    element: <SignUpFlow />,
  },
]);
