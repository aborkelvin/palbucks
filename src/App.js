import userimg2 from "./images/user2.svg";
import userimg3 from "./images/user3.svg";
import userimg4 from "./images/user4.svg";
//import userimg5 from './images/user5.svg'
//import userimg6 from './images/user6.svg'
import eventimg from "./images/eventimg.png";
import eventimg2 from "./images/eventimg2.png";
import eventimg3 from "./images/eventimg3.png";
import eventimg4 from "./images/eventimg4.jpg";
import eventimg5 from "./images/eventimg5.jpg";
import eventimg6 from "./images/eventimg7.jpg";

import environmentimg from "./images/categoryImages/environment label.svg";
import medicalimg from "./images/categoryImages/medical label.svg";
import animalimg from "./images/categoryImages/animal label.svg";

import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useHistory,
} from "react-router-dom";

import Home from "./pages/home/home";
import Settings from "./pages/settings/settings";
import Detailedevent from "./components/detailedevent/detailedevent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addNotification } from "./actions/actions";
import Organisecrowdfund from "./pages/organisecrowdfund/organisecrowdfund";
import Wallet from "./pages/wallet/wallet";
import Notificationspage from "./pages/notificationspage/notificationspage";
import Helpcenter from "./pages/helpcenter/helpcenter";
import Howitworks from "./pages/howitworks/howitworks";
import Termsofuse from "./pages/termsofuse/termsofuse";
import Privacypolicy from "./pages/privacypolicy/privacypolicy";
import CommunityGuidelines from "./pages/communityguidelines/communityguidelines";
import LandingPage from "./pages/landingpage/landingpage";
import Signinpage from "./pages/signin/signin";
import Signuppage from "./pages/signup/signup";
import Otppage from "./pages/otppage/otppage";
import Completesignup from "./pages/completeSignup/completesignup";
import PrivateRoute from "./components/privateroute/privateroute";
import { baseUrl, checkAuthentication } from "./auth/checkauthentication";
import { refreshToken } from "./auth/refreshToken";
import Loadingspinner from "./components/loadingspinner/loadingSpinner";
import Donate from "./pages/cardDonation/cardDonation";
import Profilepage from "./pages/profilepage/profilepage";
//import Pusher from 'pusher-js/types/src/core/pusher';
import Pusher from "pusher-js";
import AnonymousCrowdfundFormTitle from "./pages/AnonymousCrowdfundForm/AnonymousCrowdfundFormTitlePage";
import AnonymousCrowdfundTargetAmountPage from "./pages/AnonymousCrowdfundForm/TargetAmountPage";
import AnonymousCrowdfundFormDescription from "./pages/AnonymousCrowdfundForm/AnonymousCrowdfundFormDescriptionPage";
import AnonymousCrowdfundFormBanner from "./pages/AnonymousCrowdfundForm/AnonymousCrowdfundFormBannerPage";
import DiscoverPage from "./pages/discover/DiscoverPage";
import Kyc from "./pages/kyc/kyc";
import BankWithdrawal from "./pages/bankWithdrawal/bankwithdrawal";
import UsdtWithdrawal from "./pages/usdtWithdrawal/usdtWithdrawal";
import FundWalletWithBank from "./pages/fundWallet/fundWallet";
import FundWalletWithCrypto from "./pages/fundWallet/fundWalletWithCrypto";

function App() {
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  const logoutLoading = useSelector((state) => state.authReducer.isLoading);
  const navigate = useNavigate();

  useEffect(() => {
    // Probably also reget user details whenever this is run to update the user details in the redux store
    const verifyToken = async () => {
      const response = await checkAuthentication(dispatch);
      if (response && response.code === "token_not_valid") {
        refreshToken(dispatch, navigate);
        console.log("logging out");
        /* dispatch(setIsAuthenticated(false))                
        localStorage.clear()
        navigate('/signin') */
      }
    };

    verifyToken();

    //TODO: Consider Refresh Before Expiry, a mechanism to refresh the token a few minutes before it expires by checking the remaining time until expiration and triggering a token refresh, say, 5 minutes before the access token expires

    // Refresh the access token every 15 minutes
    const tokenRefreshInterval = setInterval(() => {
      refreshToken(dispatch, navigate);
      //alert('refresh')
    }, 15 * 60 * 1000);

    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  useEffect(() => {
    /* Implement Real time Notifications system for the app if user is signed in */

    //alert('I run')
    if (userInfo !== null) {
      //alert('true')
      // Configure pusher for notifications
      var pusher = new Pusher("a6fc775946470e47c0d0", {
        cluster: "eu",
      });

      // Subscribe to the notifications channel
      if (userInfo !== null) {
        var notificationsChannel = pusher.subscribe(userInfo.email);
      }

      // Listen for notifications
      notificationsChannel.bind("like", (data) => {
        dispatch(addNotification(data));
        console.log(data);
      });
      notificationsChannel.bind("comment", (data) => {
        dispatch(addNotification(data));
        console.log(data);
      });
      notificationsChannel.bind("milestone", (data) => {
        dispatch(addNotification(data));
        console.log(data);
      });
      notificationsChannel.bind("co-organiser-request", (data) => {
        dispatch(addNotification(data));
        console.log(data);
      });
      notificationsChannel.bind("co_organiser_response", (data) => {
        dispatch(addNotification(data));
        console.log(data);
      });
    }

    return () => {
      // Unsubscribe from Pusher channels when the component unmounts.
      notificationsChannel?.unbind_all();
      pusher?.unsubscribe(userInfo.email);
    };
  }, [isAuthenticated]);

  /* "prebuild": "node node_modules/puppeteer/install.js", */
  // Fetch CrowdfundData for SSR prerendering for detailedEvent social media sharing link preview
  /* const [crowdfundData, setCrowdfundData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCrowdfunds = async () => {
      try {
        const response = await fetch(`${baseUrl}/funding/api`);
        const crowdfunds = await response.json();

        if (response.ok) {
          console.log(crowdfunds);
          setCrowdfundData(crowdfunds);
        } else {
          console.error("Failed to fetch crowdfunds:", crowdfunds);
        }
      } catch (error) {
        console.error("Error fetching crowdfunds:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCrowdfunds();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
 */
  if (logoutLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loadingspinner />
      </div>
    );
  } else {
    return (
      <div className="h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Signinpage />} />
          <Route path="/signup" element={<Signuppage />} />
          <Route path="/otppage" element={<Otppage />} />
          <Route path="/completesignup" element={<Completesignup />} />

          <Route
            exact
            path="/home"
            element={<PrivateRoute element={<Home />} />}
          >
            <Route path="/home" element={<Home />} />
          </Route>

          {/* <Route path="/detailed/:id" element={<Detailedevent />} /> */}
          {/* SSR For detailed crowdfund event for social media preview */}
          {/* Dynamically generate routes for crowdfund details */}
          {/* {crowdfundData.map((crowdfund) => (
            <Route
              key={crowdfund.id}
              path={`/detailed/${crowdfund.id}`}
              element={<Detailedevent eventid={crowdfund.id} />}
            />
          ))} */}
          <Route path="/detailed/:id" element={<Detailedevent />} />

          <Route path="/:id/donate" element={<Donate />} />
          <Route
            path="/settings"
            element={<PrivateRoute element={<Settings />} />}
          >
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route
            path="/organisecrowdfund"
            element={<PrivateRoute element={<Organisecrowdfund />} />}
          >
            <Route path="/organisecrowdfund" element={<Organisecrowdfund />} />
          </Route>
          <Route
            path="/organisecrowdfund/:id"
            element={<PrivateRoute element={<Organisecrowdfund />} />}
          >
            <Route
              path="/organisecrowdfund/:id"
              element={<Organisecrowdfund />}
            />
          </Route>

          <Route
            path="/profilepage"
            element={<PrivateRoute element={<Profilepage />} />}
          >
            <Route path="/profilepage" element={<Profilepage />} />
          </Route>

          <Route path="/wallet" element={<PrivateRoute element={<Wallet />} />}>
            <Route path="/wallet" element={<Wallet />} />
          </Route>

          <Route path="/notificationspage" element={<Notificationspage />} />
          <Route path="/helpcenter" element={<Helpcenter />} />
          <Route path="/howitworks" element={<Howitworks />} />
          <Route path="/termsofuse" element={<Termsofuse />} />
          <Route path="/privacypolicy" element={<Privacypolicy />} />
          <Route
            path="/communityguidelines"
            element={<CommunityGuidelines />}
          />
          <Route
            path="/anonymouscrowdfundformtitle"
            element={<AnonymousCrowdfundFormTitle />}
          />
          <Route
            path="/anonymouscrowdfundformamount"
            element={<AnonymousCrowdfundTargetAmountPage />}
          />
          <Route
            path="/anonymouscrowdfundformdescription"
            element={<AnonymousCrowdfundFormDescription />}
          />
          <Route
            path="/anonymouscrowdfundformbanner"
            element={<AnonymousCrowdfundFormBanner />}
          />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/kyc" element={<Kyc />} />
          <Route path="/bankwithdrawal" element={<BankWithdrawal />} />
          <Route path="/usdtwithdrawal" element={<UsdtWithdrawal />} />
          <Route path="/bankfunding" element={<FundWalletWithBank />} />
          <Route path="/cryptofunding" element={<FundWalletWithCrypto />} />
        </Routes>
      </div>
    );
  }
}

export default App;

let data = [
  {
    organizerimg: [userimg2],
    tags: "Environment",
    categoryimg: environmentimg,
    pic: eventimg,
    organizeraccounts: ["Franca"],
    title: "This is the title of the main user’s crowdfunding kcmsdij isnd ",
    //description: "Description of the ongoing event that users will read to know what it's about",
    amt_raised: 10000,
    target_price: 12000,
    location: "Cyprus",
    days: "30",
    totaldonations: 20403,
    liked: true,
  },
  {
    organizerimg: [userimg3, userimg4],
    tags: "Refugee",
    categoryimg: animalimg,
    organizeraccounts: ["Franca", "Hikim"],
    crowdfundImage: eventimg2,
    title:
      "Research on the construction of an automatic street light with motion and light sensors",
    //description: "Description of the ongoing event that users will read to know what it's about",
    //amt_raised: 10000,
    //target_price:12000,
    location: "Singapore",
    days: "49",
    totaldonations: 20403,
    liked: false,
  },
  {
    organizerimg: [userimg3],
    tags: "Medical",
    categoryimg: medicalimg,
    crowdfundImage: eventimg3,
    organizeraccounts: ["Franca"],
    title: "Title for this particular fundevent",
    //description: "Description of the ongoing event that users will read to know what it's about",
    amt_raised: 37255010,
    target_price: 80030000,
    location: "Texas",
    days: "10",
    totaldonations: 2040323,
    liked: true,
  },
  {
    organizerimg: [userimg2, userimg3, userimg4],
    tags: "Donate",
    crowdfundImage: eventimg2,
    categoryimg: medicalimg,
    organizeraccounts: ["Franca", "Hikim", "Mane"],
    title: "Title for this particular fundevent",
    description:
      "Description of the ongoing event that users will read to know what it's about",
    amt_raised: 10000,
    target_price: 12000,
    location: "Abuja",
    days: "19",
    totaldonations: 12420403,
    liked: false,
  },
  /*
  {
    organizerimg:[userimg2, userimg3, userimg4],
    category:'Family',
    crowdfundImage: eventimg4,
    categoryimg:medicalimg,  
    organizeraccounts:['Haaland','Franca','Hikim'],
    title: 'Support Chelsea football club to pay off their transfer fees that mudryk and lukaku accumulated',
    description: "Description of the ongoing event that users will read to know what it's about",
    amt_raised: 10000,
    target_price:12000,
    location:'Abuja',
    days:'19',
    totaldonations:327820403,
    liked:true
  },
  
  {
    organizerimg:[userimg2, userimg3, userimg4],
    category:'Faith',
    crowdfundImage: eventimg5,
    categoryimg:medicalimg,  
    organizeraccounts:['Username001','Username002','Username003'],
    title: 'Title for this particular fundevent',
    description: "Description of the ongoing event that users will read to know what it's about",
    amt_raised: 10000,
    target_price:12000,
    location:'Abuja',
    days:'19',
    totaldonations:204032332,
    liked:true
  },
  {
    organizerimg:[userimg2, userimg3, userimg4],
    category:'Environment',
    crowdfundImage: eventimg6,
    categoryimg:medicalimg,  
    organizeraccounts:['Username001','Username002','Username003'],
    title: 'This is the title of the main user’s crowdfunding',
    description: "Description of the ongoing event that users will read to know what it's about",
    amt_raised: 10000,
    target_price:12000,
    location:'Abuja',
    days:'19',
    totaldonations:3220244503,
    liked:true
  },
  
  {
    organizerimg:[accountimg2,accountimg3],
    category:'Music',
    crowdfundImage: eventimg3,
    organizeraccounts:['Username001'],
    //title: 'Title for this particular fundevent',
    //description: "Description of the ongoing event that users will read to know what it's about",
    //amt_raised: 10000,
    //target_price:12000

  },
  {
    organizerimg:[accountimg2],
    organizeraccounts:['Username001'],
    //title: 'Title for this particular fundevent',
    //description: "Description of the ongoing event that users will read to know what it's about",
    amt_raised: 760000,
    target_price:1200000

  }, */
];
