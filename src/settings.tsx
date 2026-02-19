import { useNavigate, useParams } from "react-router-dom";
import "./settings.css";
import { useContext, useEffect, useRef, useState } from "react";
import { publicUserContext } from "./publicUserContext";
import type { Tables } from "./database.types";
import { supabase } from "./supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { userAuthContext } from "./userAuthContext";
import AGBComponent from "./component/agbComponent";
import DataprotectionComponent from "./component/dataProtectionComponent";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { functionContext } from "./functionContext";
import "./responsive.css";
import Nav from "./nav";
import { navContext } from "./navContext";

export default function Settings() {
  const [privateUserObject, setPrivateUserObject] = useState<
    Tables<"private_user">
  >({
    city: "",
    country: "",
    id: 0,
    PLZ: 0,
    street: "",
    house_number: 0,
    user_id: "",
  });
  const [privateUserArray, setPrivateUserArray] = useState<
    Tables<"private_user">[]
  >([]);
  const [statusText, setStatusText] = useState<string>("");
  const [privateDataExist, setPrivateDataExist] = useState<boolean>();
  const [updateProfilname, setUpdateProfilname] = useState<string>("");
  const [updatePassword, setUpdatePassword] = useState<string>("");
  const [updateAvatarFile, setUpdateAvatarFile] = useState<File | null>(null);
  //const [updateMail, setUpdateMail] = useState<string>("");
  //const [currentPrivateUserId, setCurrentPrivateUserId] = useState<number>(0);
  const [editPrivateUserDataPopUp, setEditPrivateUserDataPopUp] =
    useState<boolean>(false);
  const [updateCityName, setUpdateCityName] = useState<string>("");
  const [updateStreetName, setUpdateStreetName] = useState<string>("");
  const [updateHousenumber, setUpdateHousenumber] = useState<number>(0);
  const [updatePLZ, setUpdatePLZ] = useState<string>("");
  const [updateCountry, setUpdateCountry] = useState<string>("");
  //const [currentSessionUserId, setCurrentSessionUserId] = useState<string>("");
  const [deletePrivateUserDataPopUp, setDeletePrivateUserDataPopUp] =
    useState<boolean>(false);
  const [deleteAccountPopUp, setDeleteAccountPopUp] = useState<boolean>(false);
  const [returnConsentPopUp, setReturnConsentPopUp] = useState<boolean>(false);
  const [agbConsent, setAGBConsent] = useState<boolean>(false);
  const [dataprotectionConsent, setDataprotectionConsent] =
    useState<boolean>(false);
  const [userDataConsent, setUserDataConsent] = useState<boolean>(false);
  const navigation = useNavigate();
  const { userAuthObject, setUserAuthObject } = useContext(userAuthContext);
  const { publicUserObject, setPublicUserObject } =
    useContext(publicUserContext);
  const { loadFirstUserData } = useContext(functionContext);
  const { setCurrentActiveNavArea } = useContext(navContext);
  const resetInputFile = useRef<HTMLInputElement | null>(null);
  const { userId } = useParams();

  useEffect(() => {
    loadFirstUserData();
    const fetchData = async () => {
      console.log(publicUserObject);
      /*setStatusText(publicUserObject.status_text);
      setAGBConsent(publicUserObject.agb_consent);
      setDataprotectionConsent(publicUserObject.data_protection_consent);
      setUserDataConsent(publicUserObject.user_consent);*/
      //const { data: session } = await supabase.auth.getSession();
      /*const { data: public_user } = await supabase
        .from("public_user")
        .select()
        .eq("user_id", publicUserObject.user_id);*/
      /*if (public_user) {
        const publicUserData = public_user[0];

        setPublicUserObject({
            ...publicUserObject,
            id: publicUserData.id,
            user_id: session.session?.user.id,
            profil_name: publicUserData.profil_name,
            profil_picture: publicUserData.profil_picture,
            status_text: publicUserData.status_text,
            agb_consent: publicUserData.agb_consent,
            data_protection_consent: publicUserData.data_protection_consent,
            user_consent: publicUserData.user_consent,
          });
        //setStatusText(publicUserData.status_text);
      }*/
      /*if (session.session) {
        const sessionUserId = session.session.user.id;
        //const currentSession = session.session;
        //const currentSessionUser = session.session.user;
        //const currentSessionAppMetadata = session.session.user.app_metadata;

        setCurrentSessionUserId(sessionUserId);
      }*/
      /*setUserAuthObject({
          ...userAuthObject,
          access_token: currentSession.access_token,
          expires_at: currentSession.expires_at!,
          refresh_token: currentSession.refresh_token,
          user: {
            app_metadata: {
              provider: currentSessionAppMetadata.provider!,
              providers: [""],
            },
            aud: currentSessionUser.aud,
            confirmed_at: currentSessionUser.confirmed_at!,
            created_at: currentSessionUser.created_at,
            email: currentSessionUser.email!,
            email_confirmed_at: currentSessionUser.email_confirmed_at!,
            id: currentSessionUser.id,
            identities: [],
            is_anonymous: currentSessionUser.is_anonymous!,
            last_sign_in_at: currentSessionUser.last_sign_in_at!,
            phone: currentSessionUser.phone!,
            role: currentSessionUser.role!,
            updated_at: currentSessionUser.updated_at!,
            user_metadata: {
              email_verified: false,
            },
          },
        });*/
    };

    setCurrentActiveNavArea("settings");

    fetchData();

    return () => {
      clearPrivateInfos();
    };
  }, []);

  async function updateStatustext() {
    const { data: public_user } = await supabase
      .from("public_user")
      .select()
      .eq("user_id", userId || publicUserObject.user_id);

    if (public_user) {
      const userStatusText = public_user[0].status_text;
      console.log(userStatusText);

      if (userStatusText !== "") {
        const {} = await supabase
          .from("public_user")
          .update({ status_text: publicUserObject.status_text })
          .eq("user_id", userId || publicUserObject.user_id);

        toast.success("Dein Statustext wurde erfolgreich aktualisiert.", {
          unstyled: true,
          className: "w-[25rem] h-[5rem] px-5",
        });
        setPublicUserObject({ ...publicUserObject, status_text: "" });
      } else {
        const {} = await supabase
          .from("public_user")
          .update({ status_text: publicUserObject.status_text })
          .eq("user_id", userId || publicUserObject.user_id);

        toast.success("Dein Statustext wurde erfolgreich erstellt.", {
          unstyled: true,
          className: "w-[20rem] h-[5rem] px-5",
        });
        setPublicUserObject({ ...publicUserObject, status_text: "" });
      }
    }

    //loadFirstUserData();
  }

  async function delteStatustext() {
    const {} = await supabase
      .from("public_user")
      .update({ status_text: "" })
      .eq("user_id", userId || publicUserObject.user_id);

    toast.success("Dein Statustext wurde erfolgreich gelöscht.", {
      unstyled: true,
      className: "w-[20rem] h-[5rem] px-5",
    });

    loadFirstUserData();
    setStatusText("");
  }

  async function editProfilname(id: number, userId: string) {
    console.log(id);
    if (id) {
      if (updateProfilname !== "") {
        const {} = await supabase
          .from("public_user")
          .update({ profil_name: updateProfilname })
          .eq("user_id", userId);

        setUpdateProfilname("");
        toast.success("Dein Profilname wurde aktualisiert.", {
          unstyled: true,
          className: "w-[25rem] h-[5rem] px-5",
        });
      } else {
        toast.info("Bitte gebe einen Profilnamen ein.", {
          unstyled: true,
          className: "w-[25rem] h-[5rem] px-5",
        });
      }
    } else {
      if (updateProfilname !== "") {
        const {} = await supabase.from("public_user").insert({
          user_id: userId || publicUserObject.user_id,
          profil_name: updateProfilname,
          profil_picture: publicUserObject.profil_picture,
          status_text: publicUserObject.status_text,
          agb_consent: publicUserObject.agb_consent,
          data_protection_consent: publicUserObject.data_protection_consent,
          user_consent: publicUserObject.user_consent,
        });

        toast.success("Dein Profilname wurde erfolgreich erstellt.", {
          unstyled: true,
          className: "w-[25rem] h-[5rem] px-5",
        });
        setUpdateProfilname("");
        reloadGeneralUserData();
      } else {
        toast.info("Bitte gebe einen Profilnamen ein.", {
          unstyled: true,
          className: "w-[25rem] h-[5rem] px-5",
        });
      }
    }
  }

  async function editPasswort() {
    if (updatePassword !== "") {
      await supabase.auth.updateUser({ password: updatePassword });

      toast.success("Dein Passwort wurde erfolgreich geändert.", {
        unstyled: true,
        className: "w-[23rem] h-[5rem] px-5",
      });

      setUpdatePassword("");
    } else {
      toast.info("Bitte gebe ein Passwort ein.", {
        unstyled: true,
        className: "w-[23rem] h-[5rem] px-5",
      });
      setUpdatePassword("");
    }
  }

  function resetAvatarFile() {
    if (resetInputFile.current) {
      resetInputFile.current.value = "";
    }

    setUpdateAvatarFile(null);
  }

  async function updateProfilPicture() {
    if (!updateAvatarFile) return;

    const { data } = await supabase.storage
      .from("profilepicture")
      .upload(`all/${updateAvatarFile.name}`, updateAvatarFile, {
        cacheControl: "3600",
        upsert: false,
      });

    const {} = await supabase
      .from("public_user")
      .update({ profil_picture: data?.path })
      .eq("user_id", userId || publicUserObject.user_id);

    toast.success("Profilbild wurde aktualisiert.", {
      unstyled: true,
      className: "w-[23rem] h-[5rem] px-5",
    });

    reloadGeneralUserData();
    setUpdateAvatarFile(null);
  }

  async function deletePicture() {
    const {} = await supabase.storage
      .from("profilepicture")
      .remove([publicUserObject.profil_picture]);

    const {} = await supabase
      .from("public_user")
      .update({
        profil_picture: "",
      })
      .eq("user_id", userId || publicUserObject.user_id);

    toast.success("Profilbild wurde erfolgreich gelöscht.", {
      unstyled: true,
      className: "w-[27rem] h-[5rem] px-5",
    });
    setUpdateAvatarFile(null);

    reloadGeneralUserData();
  }

  async function reloadGeneralUserData() {
    const { data: session } = await supabase.auth.getSession();

    if (session.session) {
      const { data: public_user } = await supabase
        .from("public_user")
        .select()
        .eq("user_id", session.session.user.id);

      console.log(public_user);

      if (public_user && public_user[0] !== undefined) {
        const publicUserData = public_user[0];

        setPublicUserObject({
          ...publicUserObject,
          profil_name: publicUserData.profil_name,
          profil_picture: publicUserData.profil_picture,
          status_text: publicUserData.status_text,
        });
      }
    }
  }

  async function loadPrivateUserData() {
    const { data } = await supabase.from("private_user").select();

    if (data?.length !== 0) {
      setPrivateDataExist(true);
      setPrivateUserArray(data!);
      setPrivateUserObject(data![0]);
      //setCurrentPrivateUserId(data![0].id);
    } else {
      setPrivateDataExist(false);
      toast.info("Hinweis: Es existieren keine Adressdaten von dir.", {
        unstyled: true,
        className: "settings-notice-toasty w-[20rem] h-[5rem] px-5",
      });
    }
  }

  function openPrivateUserPopUp(update: string) {
    if (update === "update") {
      setUpdateCityName(privateUserObject.city);
      setUpdateStreetName(privateUserObject.street);
      setUpdateHousenumber(privateUserObject.house_number);
      setUpdatePLZ(String(privateUserObject.PLZ));
      setUpdateCountry(privateUserObject.country);
      setEditPrivateUserDataPopUp(true);
    } else {
      setUpdateCityName("");
      setUpdateStreetName("");
      setUpdateHousenumber(0);
      setUpdatePLZ("");
      setUpdateCountry("");
      setEditPrivateUserDataPopUp(true);
    }
  }

  async function updatePrivateUserData() {
    const findUser = privateUserArray.find((user) => {
      return user.user_id === userId || publicUserObject.user_id;
    });

    if (findUser) {
      const {} = await supabase
        .from("private_user")
        .update({
          city: updateCityName,
          street: updateStreetName,
          house_number: updateHousenumber,
          PLZ: Number(updatePLZ),
          country: updateCountry,
        })
        .eq("user_id", userId || publicUserObject.user_id);

      loadPrivateUserData();

      toast.success("Deine Adressdaten wurden erfolgreich geändert.", {
        unstyled: true,
        className: "settings-success-toasty w-[21rem] h-[5rem] px-5",
      });

      setEditPrivateUserDataPopUp(false);
    } else {
      const {} = await supabase.from("private_user").insert({
        user_id: userId || publicUserObject.user_id,
        city: updateCityName,
        street: updateStreetName,
        house_number: updateHousenumber,
        PLZ: Number(updatePLZ),
        country: updateCountry,
      });
      loadPrivateUserData();
      toast.success(
        "Deine neuen Adressdaten wurden erfolgreich in der Datenbank gespeichert.",
        {
          unstyled: true,
          className: "settings-success-toasty w-[30rem] h-[7rem] px-7",
        },
      );

      setEditPrivateUserDataPopUp(false);
      setPrivateDataExist(true);
    }
  }

  async function opendeletePrivateUserDataPopUp() {
    const { data } = await supabase.from("private_user").select();

    if (data?.length !== 0) {
      setDeletePrivateUserDataPopUp(true);
    }
  }

  async function deletePrivateUserData(id: number) {
    const {} = await supabase.from("private_user").delete().eq("id", id);

    toast.success(
      "Deine Adressdaten wurden erfolgreich aus der Datenbank entfernt.",
      {
        unstyled: true,
        className: "settings-success-toasty w-[27rem] h-[7rem] px-5",
      },
    );

    setDeletePrivateUserDataPopUp(false);
    setPrivateDataExist(false);

    setPrivateUserObject({
      ...privateUserObject,
      city: "",
      country: "",
      id: 0,
      PLZ: 0,
      street: "",
      house_number: 0,
      user_id: "",
    });
  }

  async function clearPrivateInfos() {
    setPrivateUserObject({
      ...privateUserObject,
      city: "",
      country: "",
      id: 0,
      PLZ: 0,
      street: "",
      house_number: 0,
      user_id: "",
    });
    setPrivateUserArray([]);
    //setCurrentPrivateUserId(0);
    //setCurrentSessionUserId("");
    loadFirstUserData();
  }

  async function deleteAccount() {
    const {} = await supabase
      .from("public_user")
      .delete()
      .eq("user_id", publicUserObject.user_id);

    const {} = await supabase
      .from("posts")
      .delete()
      .eq("user_id", publicUserObject.user_id);

    const {} = await supabase
      .from("comments")
      .delete()
      .eq("user_id", publicUserObject.user_id);

    const {} = await supabase
      .from("private_user")
      .delete()
      .eq("user_id", publicUserObject.user_id);

    const {} = await supabase
      .from("like_dislike_posts")
      .delete()
      .eq("user_id", publicUserObject.user_id);

    const {} = await supabase
      .from("like_dislike_comments")
      .delete()
      .eq("user_id", publicUserObject.user_id);

    const {} = await supabase
      .from("follow")
      .delete()
      .eq("user_id", publicUserObject.user_id);

    const {} = await supabase
      .from("follow")
      .delete()
      .eq("follow_user_id", publicUserObject.user_id);

    const {} = await supabase.storage
      .from("profilepicture")
      .remove([publicUserObject.profil_picture]);

    const {} = await supabase.auth.admin.deleteUser(publicUserObject.user_id);

    const {} = await supabase.auth.signOut();

    setPublicUserObject({
      ...publicUserObject,
      profil_name: "",
      profil_picture: "",
      user_id: "",
      agb_consent: false,
      data_protection_consent: false,
      user_consent: false,
    });

    setUserAuthObject({
      ...userAuthObject,
      access_token: "",
      expires_at: 0,
      expires_in: 0,
      refresh_token: "",
      token_type: "",
      user: {
        app_metadata: {
          provider: "",
          providers: [""],
        },
        aud: "",
        confirmed_at: "",
        created_at: "",
        email: "",
        email_confirmed_at: "",
        id: "",
        identities: [],
        is_anonymous: false,
        last_sign_in_at: "",
        phone: "",
        role: "",
        updated_at: "",
        user_metadata: {
          email_verified: false,
        },
      },
    });

    setDeleteAccountPopUp(false);

    navigation("/");
  }

  async function logOutReturnConsent() {
    const {} = await supabase
      .from("public_user")
      .update({
        agb_consent: false,
        data_protection_ponsent: false,
        user_consent: false,
      })
      .eq("user_id", publicUserObject.user_id);

    const {} = await supabase.auth.signOut();

    setPublicUserObject({
      ...publicUserObject,
      profil_name: "",
      user_id: "",
      agb_consent: false,
      data_protection_consent: false,
      user_consent: false,
    });

    setUserAuthObject({
      ...userAuthObject,
      access_token: "",
      expires_at: 0,
      expires_in: 0,
      refresh_token: "",
      token_type: "",
      user: {
        app_metadata: {
          provider: "",
          providers: [""],
        },
        aud: "",
        confirmed_at: "",
        created_at: "",
        email: "",
        email_confirmed_at: "",
        id: "",
        identities: [],
        is_anonymous: false,
        last_sign_in_at: "",
        phone: "",
        role: "",
        updated_at: "",
        user_metadata: {
          email_verified: false,
        },
      },
    });
    navigation("/");
  }

  return (
    <section className="settings-section h-full pb-20">
      {" "}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          unstyled: true,
          className:
            "flex justify-center items-center gap-x-5 text-xl rounded-sm",
        }}
      />
      <Nav />
      <h1 className="settings-section-headline text-center mt-5 mb-7 text-3xl">
        Einstellungen
      </h1>
      <div className="settings-section-status-text-div mx-auto my-5 flex flex-col items-center justify-center gap-y-5">
        <textarea
          name=""
          value={publicUserObject.status_text}
          onChange={(event) => {
            setPublicUserObject({
              ...publicUserObject,
              status_text: event.target.value.trimStart(),
            });
          }}
          placeholder="Statustext eingeben..."
          className="settings-section-status-textarea w-[40rem] h-[10rem] px-3 py-1 text-lg bg-white border border-gray-300 rounded-sm resize-none"
        ></textarea>
        <div className="settings-section-status-button-div flex justify-center items-center gap-x-5">
          <button
            onClick={updateStatustext}
            disabled={publicUserObject.status_text.length > 0 ? false : true}
            className={`settings-section-status-update-button px-7 py-1.5 flex justify-center items-center text-lg ${publicUserObject.status_text.length > 0 ? "bg-blue-500 text-white border border-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-blue-500 hover:border-blue-500" : "bg-gray-200 border border-gray-300"} rounded-sm`}
          >
            Statustext updaten
          </button>
          <button
            onClick={delteStatustext}
            disabled={publicUserObject.status_text.length > 0 ? false : true}
            className={`settings-section-status-delete-button px-7 py-1.5 text-lg flex justify-center items-center gap-x-1 ${statusText.length > 0 ? "bg-red-600 text-white border cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-red-600 hover:border-red-600" : "bg-gray-200 border border-gray-300"} rounded-sm`}
          >
            Statustext löschen
          </button>
        </div>
      </div>
      <div className="settings-section-generally-data-div mt-15 flex flex-col items-start justify-center">
        <p className="settings-section-generally-data-div-headline ml-[15%] text-[1.7rem]">
          Allgemeine Infos
        </p>{" "}
        <div className="settings-section-generally-data-main-div mx-auto px-20 py-10 flex flex-col items-center justify-center gap-y-7 bg-white border border-gray-400 rounded-sm shadow-lg">
          <div className="settings-section-edit-profil-name-div flex justify-center items-center gap-x-5">
            <input
              type="text"
              value={updateProfilname}
              onChange={(event) => {
                setUpdateProfilname(event.target.value.trimStart());
              }}
              name=""
              className="settings-section-edit-profil-name-input pl-5 py-1.5 text-lg bg-white border border-gray-400 rounded-sm"
              placeholder="Profilnamen eingeben"
            />
            <button
              onClick={() => {
                editProfilname(publicUserObject.id, publicUserObject.user_id);
              }}
              disabled={updateProfilname.length > 0 ? false : true}
              className={`settings-section-edit-profil-name-button px-5 py-1.5 flex justify-center items-center text-lg ${updateProfilname.length > 0 ? "bg-blue-500 text-white border border-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-blue-500 hover:border-blue-500" : "bg-gray-200 border border-gray-300"} rounded-sm`}
            >
              Profilnamen ändern
            </button>
          </div>{" "}
          <div className="settings-section-edit-password-div flex justify-center items-center gap-x-5">
            <input
              type="text"
              value={updatePassword}
              onChange={(event) => {
                setUpdatePassword(event.target.value.trimStart());
              }}
              name=""
              className="settings-section-edite-password-input pl-5 py-1.5 text-lg bg-white border border-gray-400 rounded-sm"
              placeholder="Passwort eingeben"
            />
            <button
              onClick={editPasswort}
              disabled={updatePassword.length > 0 ? false : true}
              className={`settings-section-edit-password-button px-8 py-1.5 flex justify-center items-center text-lg ${updatePassword.length > 0 ? "bg-blue-500 text-white border border-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-blue-500 hover:border-blue-500" : "bg-gray-200 border border-gray-300"} rounded-sm`}
            >
              Passwort ändern
            </button>
          </div>
          <div className="settings-section-generally-data-div-picture-div flex flex-col items-center justify-center gap-x-3">
            <div className="settings-section-medium-button-div flex justify-center align-center gap-x-1.5">
              <input
                type="file"
                onChange={(event) => {
                  const target = event.target as HTMLInputElement;
                  const file = target.files?.[0] ?? null;
                  setUpdateAvatarFile(file);
                }}
                ref={resetInputFile}
                className="settings-section-edit-picture-input w-full bg-white text-base text-gray-700
        file:me-4 file:py-1 file:px-4
        file:rounded-sm file:border-0
        file:text-lg 
        file:transition-all duration-300 ease-in-out
        file:bg-blue-500 file:text-white
        hover:file:bg-white hover:file:border-blue-500 hover:file:text-blue-500
        file:disabled:opacity-50 file:disabled:pointer-events-none
       file:cursor-pointer border border-gray-200 rounded-sm"
                name=""
              />
              <button
                onClick={resetAvatarFile}
                disabled={updateAvatarFile !== null ? false : true}
                className={`settings-section-reset-input-button px-5 py-1 text-base flex justify-center items-center gap-x-1 rounded-sm ${updateAvatarFile !== null ? "bg-red-600 border text-white border-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-red-600 hover:border-red-600" : "bg-gray-200 border border-gray-300"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="settings-section-remove-avatar-file-icon w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
                Entfernen
              </button>
            </div>
            <div className="settings-section-picture-button-div mt-5 flex justify-center items-center gap-x-5">
              <button
                onClick={updateProfilPicture}
                disabled={updateAvatarFile !== null ? false : true}
                className={`settings-section-update-picture-button px-7 py-1.5 flex justify-center items-center  text-lg ${updateAvatarFile !== null ? "bg-blue-500 text-white border border-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-blue-500 hover:border-blue-500" : "bg-gray-200 border border-gray-300"} rounded-sm`}
              >
                Profilbild updaten
              </button>
              <button
                onClick={deletePicture}
                disabled={
                  publicUserObject.profil_picture.length > 0 ? false : true
                }
                className={`settings-section-delete-picture-button px-7 py-1.5 text-lg flex justify-center items-center gap-x-1 ${publicUserObject.profil_picture.length > 0 ? "bg-red-600 text-white border transition-all duration-300 ease-in-out cursor-pointer hover:bg-white hover:text-red-600 hover:border-red-600" : "bg-gray-200 border border-gray-300"}  rounded-sm`}
              >
                Profilbild löschen
              </button>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={editPrivateUserDataPopUp}
        onOpenChange={setEditPrivateUserDataPopUp}
      >
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="settings-section-edit-private-user-popup w-full"
        >
          <DialogHeader>
            <DialogDescription className="settings-section-edit-private-user-popup-description">
              <div className="settings-section-private-data-form-div mt-5 bg-white flex flex-col gap-y-5">
                {" "}
                <p className="settings-section-mini-headline mx-auto my-2 text-black text-[22px]">
                  Alle Felder sind Freiwillig.
                </p>
                <input
                  type="text"
                  value={updateCityName}
                  onChange={(event) => {
                    setUpdateCityName(event.target.value.trimStart());
                  }}
                  className="settings-section-edit-private-user-popup-input w-[17rem] mx-auto px-3 py-1 text-lg border border-gray-400 rounded-sm"
                  name=""
                  placeholder="Stadt eingeben"
                />{" "}
                <input
                  type="text"
                  value={updateStreetName}
                  onChange={(event) => {
                    setUpdateStreetName(event.target.value.trimStart());
                  }}
                  className="settings-section-edit-private-user-popup-input w-[17rem] mx-auto px-3 py-1 text-lg border border-gray-400 rounded-sm"
                  name=""
                  placeholder="Straße eingeben"
                />
                <input
                  type="number"
                  value={updateHousenumber !== 0 ? updateHousenumber : ""}
                  onChange={(event) => {
                    setUpdateHousenumber(
                      Number(event.target.value.trimStart()),
                    );
                  }}
                  className="settings-section-edit-private-user-popup-input w-[17rem] mx-auto px-3 py-1 text-lg text-right border border-gray-400 rounded-sm"
                  name=""
                  placeholder="Hausnummer eingeben"
                />
                <input
                  type="number"
                  value={Number(updatePLZ) !== 0 ? updatePLZ : ""}
                  onChange={(event) => {
                    setUpdatePLZ(event.target.value.trimStart());
                  }}
                  className="settings-section-edit-private-user-popup-input w-[17rem] mx-auto px-3 py-1 text-lg text-right border border-gray-400 rounded-sm"
                  name=""
                  placeholder="PLZ eingeben"
                />
                <input
                  type="text"
                  value={updateCountry}
                  onChange={(event) => {
                    setUpdateCountry(event.target.value.trimStart());
                  }}
                  className="settings-section-edit-private-user-popup-input w-[17rem] mx-auto  px-3 py-1 text-lg border border-gray-400 rounded-sm"
                  name=""
                  placeholder="Land eingeben"
                />
              </div>
              <div className="settings-section-edit-private-user-popup-button-div mt-10 mb-3 flex justify-end items-center gap-x-5">
                <button
                  onClick={() => {
                    setEditPrivateUserDataPopUp(false);
                  }}
                  className="settings-section-edit-private-user-popup-close-button px-3 py-1 text-lg flex justify-center items-center bg-gray-200 text-black border border-gray-300 transition-all duration-300 ease-in-out rounded-sm cursor-pointer hover:bg-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="settings-section-cancel-icon w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                  abbrechen
                </button>{" "}
                <button
                  onClick={updatePrivateUserData}
                  disabled={
                    updateCityName.length > 0 &&
                    updateStreetName.length > 0 &&
                    updateHousenumber !== 0 &&
                    updatePLZ.length > 4 &&
                    updateCountry.length > 0
                      ? false
                      : true
                  }
                  className={`settings-section-new-private-user-popup-new-user-data-button ${
                    privateDataExist === false ? "" : "hidden"
                  } ${
                    updateCityName.length > 0 &&
                    updateStreetName.length > 0 &&
                    updateHousenumber !== 0 &&
                    updatePLZ.length > 4 &&
                    updateCountry.length > 0
                      ? "bg-blue-500 text-white border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500 transition-all duration-300 ease-in-out cursor-pointer"
                      : "bg-gray-200 border border-gray-300"
                  } px-5 py-1 text-lg flex justify-center items-center gap-x-1 rounded-sm`}
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="settings-section-new-private-user-data-icon w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Daten erstellen
                </button>
                <button
                  onClick={updatePrivateUserData}
                  disabled={
                    updateCityName.length > 0 &&
                    updateStreetName.length > 0 &&
                    updateHousenumber !== 0 &&
                    updatePLZ.length > 4 &&
                    updateCountry.length > 0
                      ? false
                      : true
                  }
                  className={`settings-section-edit-private-user-popup-update-user-data-button ${
                    privateDataExist === true ? "" : "hidden"
                  } ${
                    updateCityName.length > 0 &&
                    updateStreetName.length > 0 &&
                    updateHousenumber !== 0 &&
                    updatePLZ.length > 4 &&
                    updateCountry.length > 0
                      ? "bg-blue-500 text-white border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500 transition-all duration-300 ease-in-out cursor-pointer"
                      : "bg-gray-200 border border-gray-300"
                  } px-5 py-1 text-lg flex justify-center items-center gap-x-1 rounded-sm`}
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="settings-section-edite-private-user-data-icon w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  Daten bearbeiten
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog
        open={deletePrivateUserDataPopUp}
        onOpenChange={setDeletePrivateUserDataPopUp}
      >
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="settings-section-delete-private-user-popup"
        >
          <DialogHeader>
            <DialogDescription className="settings-section-delete-private-user-popup-description p-5 text-black flex flex-col gap-10">
              <p className="settings-section-delete-private-user-popup-note text-[18px]">
                Möchtest du deine Adressdaten wirklick löschen?
              </p>
              <div className="settings-section-delete-private-user-popup-button-div w-full flex justify-end items-center gap-x-3">
                <button
                  onClick={() => {
                    setDeletePrivateUserDataPopUp(false);
                  }}
                  className="settings-section-delete-private-user-popup-close-button px-3 py-1 text-[18px] flex justify-center items-center gap-x-1 bg-gray-200 text-black border border-gray-300 transition-all duration-300 ease-in-out rounded-sm cursor-pointer hover:bg-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="settings-section-cancel-private-user-data-icon w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                  schließen
                </button>
                <button
                  onClick={() => {
                    deletePrivateUserData(privateUserObject.id);
                  }}
                  className="settings-section-delete-private-user-popup-delete-button px-5 py-1 text-lg flex justify-center items-center gap-x-1 bg-red-600 text-white border rounded-sm transition-all duration-300 ease-in-out cursor-pointer hover:bg-white hover:text-red-600 hover:border-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="settings-section-delete-private-user-date-delete-icon w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  Daten löschen
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="settings-section-private-data-div mt-15 py-5 flex flex-col items-start justify-center">
        <p className="settings-section-private-data-div-headline text-2xl ml-[15%] my-5">
          Private Infos
        </p>
        <button
          onClick={loadPrivateUserData}
          className="settings-section-private-data-div-load-button ml-[15%] px-5 py-1.5 flex justify-center items-center text-lg bg-blue-500 text-white border border-white rounded-sm cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-blue-500 hover:border-blue-500"
        >
          Daten laden
        </button>
        <div className="settings-section-private-data-overview-div w-full mt-7 mx-auto flex flex-col justify-around items-center gap-y-3">
          <div className="settings-section-private-data-div-table bg-gray-50 shadow-lg">
            <div className="settings-section-table-headline-div">
              <th className="settings-section-table-head-title w-[200px] py-1 text-lg border border-gray-400">
                Stadt
              </th>
              <th className="settings-section-table-head-title w-[200px] py-1 text-lg border border-gray-400">
                Straße
              </th>
              <th className="settings-section-table-head-title w-[200px] py-1 text-lg border border-gray-400">
                Hausnummer
              </th>
              <th className="settings-section-table-head-title w-[200px] py-1 text-lg border border-gray-400">
                PLZ
              </th>
              <th className="settings-section-table-head-title w-[200px] py-1 text-lg border border-gray-400">
                Land
              </th>
            </div>
            <div className="settings-section-table-info-div">
              <td className="settings-section-private-data-div-info w-[200px] px-3 text-[17px] bg-white border border-gray-400">
                {privateUserObject.city}
              </td>
              <td className="settings-section-private-data-div-info w-[200px] px-3 text-[17px] bg-white border border-gray-400">
                {privateUserObject.street}
              </td>
              <td className="settings-section-private-data-div-info number w-[200px] h-[40px] px-3 text-[17px] text-right bg-white border border-gray-400">
                {privateUserObject.house_number !== 0
                  ? privateUserObject.house_number
                  : ""}
              </td>
              <td className="settings-section-private-data-div-info number w-[200px] px-3 text-[17px] text-right bg-white border border-gray-400">
                {privateUserObject.PLZ !== 0 ? privateUserObject.PLZ : ""}
              </td>
              <td className="settings-section-private-data-div-info w-[200px] px-3 text-[17px] bg-white border border-gray-400">
                {privateUserObject.country}
              </td>
            </div>
          </div>
          <div className="settings-section-private-user-data-div-button-div mt-5 flex justify-center items-center gap-x-5">
            <button
              onClick={() => {
                openPrivateUserPopUp("");
              }}
              className={`${
                privateDataExist === false
                  ? "bg-blue-500 text-white border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500 cursor-pointer transition-all duration-300 ease-in-out"
                  : "bg-gray-200 border border-gray-300"
              } settings-section-create-private-data-button px-6 py-2 flex justify-center items-center gap-x-1 text-lg rounded-sm`}
              disabled={privateDataExist}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="settings-section-open-new-private-user-data-popup-icon w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Daten erstellen
            </button>
            <button
              onClick={() => {
                openPrivateUserPopUp("update");
              }}
              disabled={!privateDataExist}
              className={`settings-section-update-private-data-button px-6 py-2 flex justify-center items-center gap-x-1 text-lg rounded-sm ${
                privateDataExist === true
                  ? "bg-blue-500 text-white border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500 cursor-pointer transition-all duration-300 ease-in-out"
                  : "bg-gray-200 border border-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="settings-section-open-update-private-user-data-popup-icon w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Daten bearbeiten
            </button>
            <button
              onClick={opendeletePrivateUserDataPopUp}
              disabled={!privateDataExist}
              className={`settings-section-delete-private-data-button px-6 py-2 text-lg flex justify-center items-center gap-x-1 border rounded-sm ${
                privateDataExist === true
                  ? "bg-red-600 text-white hover:bg-white hover:text-red-600 hover:border-red-600 cursor-pointer transition-all duration-300 ease-in-out"
                  : "bg-gray-200 border border-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="settings-section-open-delete-private-user-data-popup-icon w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              Daten löschen
            </button>
          </div>
        </div>
      </div>
      <Dialog open={returnConsentPopUp} onOpenChange={setReturnConsentPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="settings-section-return-consent-popup"
        >
          <DialogHeader>
            <DialogDescription className="settings-section-return-consent-popup-description p-5 text-black flex flex-col gap-10">
              <span className="settings-section-return-consent-popup-content  text-[24px] text-red-500">
                Achtung
              </span>
              <span className="settings-section-return-consent-popup-content text-[20px]">
                Einwilligung zurückgezogen
              </span>
              <p className="settings-section-return-consent-popup-content text-[18px]">
                Du hast mindestens eine erforderliche Einwilligung widersprochen
                (z.B. AGB, Datenschutz).
                <br />
                <br />
                OpenPureNet kann ohne deine vollständige Zustimmung leider nicht
                genutz werden.
                <br />
                <br />
                Bist du dir sicher, dass du die Einwilligung zurückziehen
                willst?
              </p>
              <div className="settings-section-return-consent-popup-button-div w-full flex justify-end items-center gap-x-3">
                <button
                  onClick={() => {
                    setAGBConsent(true);
                    setDataprotectionConsent(true);
                    setUserDataConsent(true);
                    setReturnConsentPopUp(false);
                  }}
                  className="settings-section-return-consent-popup-close-button px-3 py-1 text-[18px] flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 cursor-pointer rounded-sm hover:bg-white"
                >
                  Nein schließen
                </button>
                <button
                  onClick={logOutReturnConsent}
                  className="settings-section-return-consent-popup-logout-button px-5 py-1 text-lg flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500"
                >
                  Ja ausloggen
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="settings-section-return-consent-div mx-auto mt-20">
        <h2 className="settings-section-return-consent-div-headline ml-[15rem] text-3xl">
          Widerrufsrecht und Einwilligung
        </h2>
        <div className="settings-section-agb-div flex flex-col items-start justify-center gap-y-3">
          <h2 className="settings-section-agb-div-headline ml-[15rem] mt-10 mb-5 text-2xl">
            Allgemine Geschäftsbedingungen
          </h2>
          <div className="settings-section-agb-overview w-[75%] h-[500px] mx-auto bg-white border border-gray-400 rounded-sm overflow-hidden">
            <div className="settings-section-agb-overview-scroll-div w-full h-full px-7 py-5 overflow-y-scroll">
              <AGBComponent />
            </div>
          </div>
          <div className="settings-section-agb-accept-div w-ful mt-1 text-lg flex justify-start items-center gap-x-3">
            <input
              type="checkbox"
              checked={agbConsent}
              onChange={(event) => {
                setAGBConsent(event.target.checked);
                setReturnConsentPopUp(true);
              }}
              className="settings-section-agb-input-checkbox ml-[15rem] cursor-pointer"
              name=""
            />{" "}
            Akzeptieren
          </div>
        </div>

        <div className="settings-section-data-protection-div flex flex-col items-start justify-center gap-y-5">
          <h2 className="settings-section-data-protection-headline ml-[15rem] mt-10 mb-5 text-2xl">
            Datenschutzerklärung
          </h2>
          <div className="settings-section-data-protection-overview w-[75%] h-[500px] mx-auto py-5 bg-white border border-gray-400 rounded-sm overflow-hidden">
            <div className="settings-section-data-protection-overview-scroll-div w-full h-full px-7 py-5 overflow-y-scroll">
              <DataprotectionComponent />
            </div>
          </div>
          <div className="settings-section-data-protection-accept-div w-ful mt-1 text-lg flex justify-start items-center gap-x-3">
            <input
              type="checkbox"
              checked={dataprotectionConsent}
              onChange={(event) => {
                setDataprotectionConsent(event.target.checked);
                setReturnConsentPopUp(true);
              }}
              className="settings-section-data-protection-input-checkbox ml-[15rem] cursor-pointer"
              name=""
            />
            Akzeptieren
          </div>
        </div>

        <div className="settings-section-user-consent-div flex flex-col items-start justify-center gap-y-5">
          <h2 className="settings-section-user-consent-headline ml-[15rem] mt-10 mb-5 text-2xl">
            Einwilligung zur Datenverarbeitung <wbr /> durch Drittanbieter
          </h2>
          <div className="settings-section-user-consent-text w-[75%] mx-auto p-5 text-lg bg-white border border-gray-400 rounded-sm">
            Ich willige ein, dass meine freiwilligen angegebenen
            personenbezogenen Daten (z.B. Adresse, Stadt, Telefonnummer), im
            Rahmen der Nutzung der Plattform OpenPureNet, an den Dienstleister
            SupaBase Inc. übermittelt und dort gemäß deren
            Datenschutzrichtlinien gespeichert und verarbeitet werden. Die
            Datenverarbeitung dient ausschließlich der technischen
            Bereitstellung und Sicherheit meines Nutzerkontos. Ich kann diese
            Einwilligung jederzeit widerrufen.
          </div>
          <div className="settings-section-user-consent-accept-div w-ful mt-1 text-lg flex justify-start items-center gap-x-3">
            <input
              type="checkbox"
              checked={userDataConsent}
              onChange={(event) => {
                setUserDataConsent(event.target.checked);
                setReturnConsentPopUp(true);
              }}
              className="settings-section-user-consent-input-checkbox ml-[15rem] cursor-pointer"
              name=""
            />
            Akzeptieren
          </div>
        </div>
      </div>
      <Dialog open={deleteAccountPopUp} onOpenChange={setDeleteAccountPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="settings-section-delete-account-popup !max-w-xl"
        >
          <DialogHeader>
            <DialogDescription className="settings-section-delete-account-popup-description p-5 text-black flex flex-col gap-10">
              <p className="settings-section-delete-account-popup-content text-[18px]">
                Achtung
                <br />
                <br />
                Du bist gerade dabei deinen Account zu löschen.
                <br />
                <br />
                Bist du dir sicher das du deinen Account löschen möchtest?
              </p>
              <div className="settings-section-delete-account-popup-button-div w-full flex justify-end items-center gap-x-3">
                <button
                  onClick={() => {
                    setDeleteAccountPopUp(false);
                  }}
                  className="settings-section-delete-account-popup-close-button px-3 py-1 text-[18px] flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 cursor-pointer rounded-sm hover:bg-white"
                >
                  Nein Account nicht löschen
                </button>
                <button
                  onClick={deleteAccount}
                  className="settings-section-delete-account-popup-delete-button px-5 py-1 text-lg flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500"
                >
                  Ja Account löschen
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="settings-section-delete-account-div mt-20">
        <button
          onClick={() => {
            setDeleteAccountPopUp(true);
          }}
          className="settings-section-delete-user-account ml-[15rem] px-5 py-1 text-lg flex justify-center items-center gap-x-1 bg-red-600 text-white border rounded-sm cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:text-red-600 hover:border-red-600"
        >
          Account löschen
        </button>
      </div>
    </section>
  );
  /*
 <div>
              <input
                type="text"
                value={updateMail}
                onChange={(event) => {
                  setUpdateMail(event.target.value);
                }}
                className="bg-white"
                name=""
              />
              <button onClick={editMail}>Klick</button>
            </div>

            <Dialog open={noticeSettingsPopUp} onOpenChange={setNoticeSettingsPopUp}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription className="p-5 text-black flex flex-col gap-10">
              <p className="text-[18px]">{noticeSettingsMessage}</p>
              <button
                onClick={() => {
                  setNoticeSettingsMessage("");
                  setNoticeSettingsPopUp(false);
                }}
                className="px-3 py-1 text-[18px] flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 cursor-pointer rounded-sm hover:bg-white"
              >
                schließen
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
  */
}
