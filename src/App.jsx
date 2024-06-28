import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Password from "./pages/Password";
import NotFound from "./pages/NotFound";
import MyAccount from "./pages/MyAccount";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { useEffect} from "react";
import { isAuthAtom, userAtom } from "./app/atoms";
import EditProduct from "./components/EditProduct";
import ProductPage from "./pages/ProductPage";
import EditComment from "./pages/EditComment";
import OrderPage from "./pages/OrderPage";
import Menu from "./components/NavCircle/Menu/Menu"; 
import Home from "./pages/Home/Home"; 
import Contact from "./pages/Contact/Contact"; 
import NoticeModal from "./components/NoticeModal";
import PrivateRoute from "./components/PrivateRoute";
import LegalMentions from "./pages/LegalMentions";
import Brand from "./pages/Brand/Brand";
import Maintenance from "./pages/Maintenance/Maintenance";
import Configurator from "./pages/Configurator/Configurator";
import { useState } from "react";
import { loadCookie } from "./app/utils";
import { unknownUser } from "./app/atoms";
import CreateProduct from "./components/CreateProduct";
import AccessibilityIcon from "./components/acessibility/AccessibilityIcon";
import Shop from "./pages/Shop/Shop"; 

const api_url = import.meta.env.VITE_BACK_API_URL;

function App() {
  const isLoggedIn = useAtomValue(isAuthAtom);
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    setUser(loadCookie() ? loadCookie() : unknownUser);
  }, [setUser]);

  // Récupérer les produits depuis l'API
  const [products, setProducts] = useState([]);
  // Récupérer les produits depuis l'API
  useEffect(() => {
    fetch(`${api_url}/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [isLoggedIn]);
  // Routes pour user connecté
  function wrapPrivateRoute(element, redirect, isAuth) {
    return (
      <PrivateRoute redirect={redirect} isAuth={isAuth}>
        {element}
      </PrivateRoute>
    );
  }

  return (
    <BrowserRouter>
      <Menu /> {/* Utilisation de NavCircle */}
      <NoticeModal />
      <main>
        <Routes>
          {/* ROUTES PUBLIQUES */}
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home products={products} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/:action" element={<Password />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/mentions-legales" element={<LegalMentions />} />
          <Route path="/configurator" element={<Configurator allProducts={products} />} />
          <Route path="/shop" element={<Shop products={products} />} />

          <Route path="/configurateur" element={<Configurator />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/shop" element={<Shop />} /> {/* Added route for Shop component */}
          {/* ROUTES PRIVÉES */}
          <Route
            path="/my_account/*"
            element={wrapPrivateRoute(<MyAccount />, "my_account", isLoggedIn)}
          />
          <Route
            path="/admin/*"
            element={wrapPrivateRoute(<Dashboard />, "admin", isLoggedIn)}
          />
          <Route path="/products/new" element={<CreateProduct />} />
           <Route
            path="/order/:orderId"
            element={wrapPrivateRoute(<OrderPage />, "my_account", isLoggedIn)}
          />
          <Route path="/products/:id/edit" element={wrapPrivateRoute(<EditProduct />, "admin", isLoggedIn)} />
          <Route
            path="/products/:productId/comments/:commentId/edit"
            element={wrapPrivateRoute(<EditComment />, "", isLoggedIn)}
          />
         
        </Routes>
      </main>
      <AccessibilityIcon />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
