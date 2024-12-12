import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';
import { Navigate, Outlet } from "react-router-dom";


const PrivateRoute = ({allowedScopes}) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/"/>;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userScope = decodedToken.scope;
        console.log(userScope)
        const hasAccess = allowedScopes
            ? allowedScopes.includes(userScope)
            : true;

        return hasAccess
            ? <Outlet/>
            : <Navigate to="/*"/>;

    } catch (error) {
        console.log(error);
        return <Navigate to="/"/>;
    }
};
PrivateRoute.propTypes = {
    allowedScopes: PropTypes.arrayOf(PropTypes.string)
};

PrivateRoute.defaultProps = {
    allowedScopes: null
};

export default PrivateRoute;