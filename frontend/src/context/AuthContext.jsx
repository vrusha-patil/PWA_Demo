import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        try {

            const savedUser =
                localStorage.getItem("user");

            const token =
                localStorage.getItem("token");

            if (savedUser && token) {

                const parsedUser =
                    JSON.parse(savedUser);

                setUser(parsedUser);

            } else {

                localStorage.removeItem("user");
                localStorage.removeItem("token");

                setUser(null);
            }

        } catch (error) {

            console.error(
                "Restore authentication error:",
                error
            );

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            setUser(null);

        } finally {

            setLoading(false);

        }

    }, []);


    const login = async (email, password) => {

        const response = await api.post(
            "/auth/login",
            {
                email,
                password,
            }
        );

        const {
            token,
            user,
        } = response.data;


        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        setUser(user);

        return response.data;
    };

    const logout = () => {

        // Remove authentication information
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Clear React authentication state
        setUser(null);

        // Go back to login page
        window.location.href = "/login";
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};