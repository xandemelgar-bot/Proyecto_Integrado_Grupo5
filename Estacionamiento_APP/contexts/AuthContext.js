
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../services/firebase";

// Crear el contexto
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorPerfil, setErrorPerfil] = useState(null);

  // Detectar cambios en la sesión de Firebase
  useEffect(() => {
    let activo = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!activo) return;

        setLoading(true);
        setErrorPerfil(null);

        if (!firebaseUser) {
          setUsuario(null);
          setPerfil(null);
          setLoading(false);
          return;
        }

        setUsuario(firebaseUser);
        setPerfil(null);

        try {
          const referencia = doc(
            db,
            "usuarios",
            firebaseUser.uid
          );

          const documento = await getDoc(referencia);

          if (!activo) return;

          if (documento.exists()) {
            setPerfil({
              id: documento.id,
              ...documento.data(),
            });
          } else {
            setErrorPerfil(
              "No se encontró el perfil del usuario."
            );
          }
        } catch (error) {
          if (!activo) return;

          console.log(
            "Error al obtener perfil:",
            error.code
          );

          setErrorPerfil(
            "No se pudo cargar el perfil. Verifica tu conexión."
          );
        } finally {
          if (activo) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      activo = false;
      unsubscribe();
    };
  }, []);

  // Iniciar sesión
  const iniciarSesion = async (correo, contrasena) => {
    const resultado = await signInWithEmailAndPassword(
      auth,
      correo.trim().toLowerCase(),
      contrasena
    );

    return resultado.user;
  };

  // Cerrar sesión
  const cerrarSesion = async () => {
    await signOut(auth);
  };

  // Volver a cargar el perfil
  const recargarPerfil = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    setErrorPerfil(null);

    try {
      const referencia = doc(
        db,
        "usuarios",
        auth.currentUser.uid
      );

      const documento = await getDoc(referencia);

      if (documento.exists()) {
        setPerfil({
          id: documento.id,
          ...documento.data(),
        });
      } else {
        setPerfil(null);
        setErrorPerfil(
          "No se encontró el perfil del usuario."
        );
      }
    } catch (error) {
      setPerfil(null);
      setErrorPerfil(
        "No se pudo cargar el perfil."
      );
    } finally {
      setLoading(false);
    }
  };

  const esAdmin = perfil?.rol === "admin";

  return (
    <AuthContext.Provider
      value={{
        usuario,
        perfil,
        loading,
        errorPerfil,
        esAdmin,
        iniciarSesion,
        cerrarSesion,
        recargarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acceder fácilmente al contexto
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return contexto;
}
