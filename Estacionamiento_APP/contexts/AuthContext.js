
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../services/firebase";

// ==========================================
// CONTEXTO DE AUTENTICACIÓN
// ==========================================

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorPerfil, setErrorPerfil] = useState(null);

  // ==========================================
  // DETECTAR SESIÓN DE FIREBASE
  // ==========================================

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

  // ==========================================
  // INICIAR SESIÓN
  // ==========================================

  const iniciarSesion = async (correo, contrasena) => {
    const resultado = await signInWithEmailAndPassword(
      auth,
      correo.trim().toLowerCase(),
      contrasena
    );

    return resultado.user;
  };

  // ==========================================
  // REGISTRAR NUEVO USUARIO
  // ==========================================

  const registrarUsuario = async (
    correo,
    contrasena,
    nombre
  ) => {
    const correoLimpio = correo.trim().toLowerCase();
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio || !correoLimpio || !contrasena) {
      throw new Error("Completa todos los campos.");
    }

    if (contrasena.length < 6) {
      throw new Error(
        "La contraseña debe tener al menos 6 caracteres."
      );
    }

    let nuevoUsuario = null;

    try {
      // Crear cuenta en Firebase Authentication
      const resultado = await createUserWithEmailAndPassword(
        auth,
        correoLimpio,
        contrasena
      );

      nuevoUsuario = resultado.user;

      // Guardar perfil en Firestore
      const nuevoPerfil = {
        nombre: nombreLimpio,
        correo: correoLimpio,
        rol: "usuario",
        estado: "activo",
        fechaCreacion: serverTimestamp(),
      };

      await setDoc(
        doc(db, "usuarios", nuevoUsuario.uid),
        nuevoPerfil
      );

      // Actualizar nombre visible
      try {
        await updateProfile(nuevoUsuario, {
          displayName: nombreLimpio,
        });
      } catch (error) {
        console.log(
          "No se pudo actualizar el nombre visible:",
          error.code
        );
      }

      // Actualizar estado local
      setUsuario(nuevoUsuario);
      setPerfil({
        id: nuevoUsuario.uid,
        nombre: nombreLimpio,
        correo: correoLimpio,
        rol: "usuario",
        estado: "activo",
      });

      setErrorPerfil(null);
      setLoading(false);

      return nuevoUsuario;

    } catch (error) {
      console.log(
        "Error al registrar usuario:",
        error.code,
        error.message
      );

      // Si Authentication creó la cuenta pero
      // Firestore falló, intentar revertir el registro.
      if (nuevoUsuario) {
        try {
          await deleteUser(nuevoUsuario);
        } catch (rollbackError) {
          console.log(
            "No se pudo revertir el registro:",
            rollbackError.code
          );

          // Evitar dejar una sesión activa sin perfil.
          try {
            await signOut(auth);
          } catch (_) {}
        }
      }

      throw error;
    }
  };

  // ==========================================
  // RESTABLECER CONTRASEÑA
  // ==========================================

  const restablecerContrasena = async (correo) => {
    const correoLimpio = correo.trim().toLowerCase();

    if (!correoLimpio) {
      throw new Error(
        "Ingresa tu correo electrónico."
      );
    }

    await sendPasswordResetEmail(
      auth,
      correoLimpio
    );
  };

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const cerrarSesion = async () => {
    await signOut(auth);
  };

  // ==========================================
  // RECARGAR PERFIL
  // ==========================================

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

  // ==========================================
  // IDENTIFICAR ADMINISTRADOR
  // ==========================================

  const esAdmin = perfil?.rol === "admin";

  // ==========================================
  // COMPARTIR FUNCIONES
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        usuario,
        perfil,
        loading,
        errorPerfil,
        esAdmin,
        iniciarSesion,
        registrarUsuario,
        restablecerContrasena,
        cerrarSesion,
        recargarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// HOOK useAuth
// ==========================================

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return contexto;
}
