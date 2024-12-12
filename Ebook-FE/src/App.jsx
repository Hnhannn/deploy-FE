import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Sider from "./components/admin/aside";
import HeaderAdmin from "./components/admin/header";
import Footer from "./components/footer";
import Header from "./components/header";
import "./style.css";
// import LoadingSkeleton from "./components/Loading/LoadingSkeleton";
import { HeaderPackagePlan, PreOrderHeader } from "./components";
import { Audiobook, Bookcase, BookcaseProfile, BookDetails, Cart, Compose, Ebook, Home_page, Information, Main, More_stories, My_story, NotFound, Order_successfully, PackagePlans, PaperBook, Payment, PaymentResult, PreOrder, PrivateRoute, Profile, Readbook, Register, Signin, Test, Transaction_histories, PreOrderToCart} from "./pages";
import { AddAuthor, Author, Bookform, Category, Dashboard, Oder, Statistics, Package, Publisher, StoryBook, UserManagement, SliderShow, AdminManagement ,Admin  } from "./pages/admin";

function App() {
  useEffect(() => {
    document.title = "YuKi - Đam Mê Đọc Sách, Kết Nối Tri Thức!";
  }, []);
  return (
    <Router>
      <div className="bg-[rgba(18,18,19,255)] text-white">
        <div className="layout-web w-full min-h-screen bg-background">
          <Routes>
            <Route exact path="/" element={ <> <Header /> <Main /> <Footer /> </> } />
            <Route exact path="*" element={ <> <Header /> <NotFound /> <Footer /> </> } />
            <Route exact path="/ebook" element={ <> <Header /> <Ebook /> <Footer /> </> } />
            <Route exact path="/sach-noi" element={ <> <Header /> <Audiobook /> <Footer /> </> } />
            <Route exact path="/book-details/:id" element={ <> <Header /> <BookDetails /> <Footer /> </> } />
            <Route exact path="/package-plans" element={ <> <HeaderPackagePlan /> <PackagePlans /> <Footer /> </> } />
            <Route exact path="/payment/:id" element={<PrivateRoute allowedScopes={["CLIENT"]} />}>
             <Route exact path="/payment/:id" element={ <> <HeaderPackagePlan /> <Payment /> <Footer /> </> } />
            </Route>
            <Route exact path="/preordertocart" element={<PrivateRoute allowedScopes={["CLIENT"]} />}>
             <Route exact path="/preordertocart" element={ <> <PreOrderHeader /> <PreOrderToCart /> <Footer /> </> } />
            </Route>
            <Route exact path="/preorder" element={<PrivateRoute allowedScopes={["CLIENT"]} />}>
              <Route exact path="/preorder/:id" element={ <> <PreOrderHeader /> <PreOrder /> <Footer /> </> } />
            </Route>
            <Route exact path="/paperbook" element={ <> <Header /> <PaperBook /> <Footer /> </> } />
            <Route exact path="/read-book/:id" element={<Readbook />} />
            <Route exact path="/profile" element={<PrivateRoute allowedScopes={["CLIENT"]} />}>
              <Route exact path="/profile" element={ <> <Header /> <Profile /> <Footer /> </> } />
            </Route>
            <Route exact path="/Search" element={ <> <Header /> <Test /> <Footer /> </> } />
            <Route exact path="/Signin" element={ <> <Signin /> <Footer /> </> } />
            <Route exact path="/Register" element={<Register />} />
            <Route exact path="/My_story" element={ <> <My_story /> <Footer /> </> } />
            <Route exact path="/Information" element={<PrivateRoute allowedScopes={["CLIENT"]} />}>
              <Route exact path="/Information" element={ <> <Information /> <Footer /> </> } />
            </Route>
            <Route exact path="/Home_page" element={ <> <Home_page /> <Footer /> </> } />
            <Route exact path="/Compose" element={ <> <Compose /> <Footer /> </> } />
            <Route exact path="/Bookcase" element={ <> <Bookcase /> <Footer /> </> } />
            <Route exact path="/vnpay-payment" element={<PrivateRoute allowedScopes={["CLIENT"]} />}>
              <Route exact path="/vnpay-payment" element={ <> <HeaderPackagePlan /> <PaymentResult /> </> } />
            </Route>
            <Route exact path="/order_successfully" element={<PrivateRoute allowedScopes={["CLIENT"]} />}>
              <Route exact path="/order_successfully" element={ <> <HeaderPackagePlan /> <Order_successfully /> </> } />
            </Route>
            <Route exact path="/cart" element={ <> <Header /> <Cart /> <Footer /> </> } />
            <Route exact path="/BookcaseProfile" element={ <> <Header /> <BookcaseProfile /> <Footer /> </> } />
            {/* Private Route */}
            <Route exact path="/admin" element={<PrivateRoute allowedScopes={["ADMIN"]} />}> 
              <Route exact path="/admin/statistics" element={ <> <Sider /> <HeaderAdmin /> <Statistics /> </> } />
              <Route exact path="/admin/dashboard" element={ <> <Sider /> <HeaderAdmin /> <Dashboard /> </> } />
              <Route exact path="/admin/users-admin" element={ <> <Sider /> <HeaderAdmin /> <AdminManagement /> </> } />
              <Route exact path="/admin/users-client" element={ <> <Sider /> <HeaderAdmin /> <UserManagement /> </> } />
              <Route exact path="/admin/book-add" element={ <> <Sider /> <HeaderAdmin /> <Bookform /> </> } />
              <Route exact path="/admin/story-book" element={ <> <Sider /> <HeaderAdmin /> <StoryBook /> </> } />
              <Route exact path="/admin/category" element={ <> <Sider /> <HeaderAdmin /> <Category /> </> } />
              <Route exact path="/admin/oder" element={ <> <Sider /> <HeaderAdmin /> <Oder /> </> } />
              <Route exact path="/admin/author" element={ <> <Sider /> <HeaderAdmin /> <Author /> </> } />
              <Route exact path="/admin/author-add" element={ <> <Sider /> <HeaderAdmin /> <AddAuthor /> </> } />
              <Route exact path="/admin/publisher" element={ <> <Sider /> <HeaderAdmin /> <Publisher /> </> } />
              <Route exact path="/admin/package" element={ <> <Sider /> <HeaderAdmin /> <Package /> </> } />
              <Route exact path="/admin/sliderShow" element={ <> <Sider /> <HeaderAdmin /> <SliderShow /> </> } />
            </Route>
            <Route exact path="/More_stories" element={ <> <More_stories /> <Footer /> </> } />
            <Route exact path="/transaction-histories" element={ <> <Header /> <Transaction_histories /> <Footer /> </> } />
            <Route exact path="/admin/login" element={<Admin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;
