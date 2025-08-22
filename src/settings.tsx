import { useNavigate } from "react-router-dom";
import "./settings.css";
import { useContext, useEffect, useState } from "react";
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

export default function Settings() {
  const [privateUserObject, setPrivateUserObject] = useState<
    Tables<"private-user">
  >({
    city: "",
    country: "",
    id: 0,
    PLZ: "",
    street: "",
    houseNumber: 0,
    userId: "",
  });
  const [privateUserArray, setPrivateUserArray] = useState<
    Tables<"private-user">[]
  >([]);
  const [statusText, setStatusText] = useState<string>("");
  const [privateDataExist, setPrivateDataExist] = useState<boolean>();
  const [updateProfilname, setUpdateProfilname] = useState<string>("");
  const [updatePassword, setUpdatePassword] = useState<string>("");
  const [updateAvatarFile, setUpdateAvatarFile] = useState<File | null>(null);
  //const [updateMail, setUpdateMail] = useState<string>("");
  const [currentPrivateUserId, setCurrentPrivateUserId] = useState<number>(0);
  const [editPrivateUserDataPopUp, setEditPrivateUserDataPopUp] =
    useState<boolean>(false);
  const [updateCityName, setUpdateCityName] = useState<string>("");
  const [minimumSignCityName, setMinimumSignCityName] =
    useState<boolean>(false);
  const [updateStreetName, setUpdateStreetName] = useState<string>("");
  const [minimumSignStreetName, setMinimumSignStreetName] =
    useState<boolean>(false);
  const [updateHousenumber, setUpdateHousenumber] = useState<number>(0);
  const [minimumSignHousenumber, setMinimumSignHousenumber] =
    useState<boolean>(false);
  const [updatePLZ, setUpdatePLZ] = useState<string>("");
  const [minimumSignPLZ, setMinimumSignPLZ] = useState<boolean>(false);
  const [updateCountry, setUpdateCountry] = useState<string>("");
  const [minimumSignCountry, setMinimumSignCountry] = useState<boolean>(false);
  const [currentSessionUserId, setCurrentSessionUserId] = useState<string>("");
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
  const { checkUserSession } = useContext(functionContext);

  useEffect(() => {
    const fetchData = async () => {
      const { data: session } = await supabase.auth.getSession();

      if (session.session) {
        const accessToken = session.session.access_token;
        const sessionUserId = session.session.user.id;
        setUserAuthObject({ ...userAuthObject, accessToken: accessToken });
        setCurrentSessionUserId(sessionUserId);
      }

      setStatusText(publicUserObject.Statustext);
      setAGBConsent(publicUserObject.AGBConsent);
      setDataprotectionConsent(publicUserObject.dataProtectionConsent);
      setUserDataConsent(publicUserObject.userDataConsent);
    };

    fetchData();
  }, []);

  async function updateStatustext() {
    if (statusText !== "") {
      if (publicUserObject.Statustext === "") {
        const {} = await supabase
          .from("public-user")
          .update({ Statustext: statusText })
          .eq("userId", publicUserObject.userId);

        toast.success("Dein Statustext wurde erfolgreich erstellt.", {
          unstyled: true,
          className: "w-[20rem] h-[5rem] px-5",
        });
        setStatusText("");
      } else {
        const {} = await supabase
          .from("public-user")
          .update({ Statustext: statusText })
          .eq("userId", publicUserObject.userId);

        toast.success("Dein Statustext wurde erfolgreich aktualisiert.", {
          unstyled: true,
          className: "w-[25rem] h-[5rem] px-5",
        });
        setStatusText("");
      }
    }

    checkUserSession();
  }

  async function delteStatustext() {
    const {} = await supabase
      .from("public-user")
      .update({ Statustext: "" })
      .eq("userId", publicUserObject.userId);

    toast.success("Dein Statustext wurde erfolgreich gelöscht.", {
      unstyled: true,
      className: "w-[20rem] h-[5rem] px-5",
    });

    checkUserSession();
    setStatusText("");
  }

  async function editProfilname(id: number, userId: string) {
    if (id) {
      if (updateProfilname !== "") {
        const {} = await supabase
          .from("public-user")
          .update({ Profilname: updateProfilname })
          .eq("userId", userId);

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
        const {} = await supabase.from("public-user").insert({
          userId: currentSessionUserId,
          Profilname: updateProfilname,
          AGBConsent: true,
          dataProtectionConsent: true,
          userDataConsent: true,
        });

        toast.success("Dein Profilname wurde erfolgreich erstellt.", {
          unstyled: true,
          className: "w-[25rem] h-[5rem] px-5",
        });
        setUpdateProfilname("");
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

  async function updateProfilPicture() {
    if (!updateAvatarFile) return;

    const { data } = await supabase.storage
      .from("profilepicture")
      .upload(`all/${updateAvatarFile.name}`, updateAvatarFile, {
        cacheControl: "3600",
        upsert: false,
      });

    const {} = await supabase
      .from("public-user")
      .update({ profilPicture: data?.path })
      .eq("userId", publicUserObject.userId);

    toast.success("Profilbild wurde aktualisiert.", {
      unstyled: true,
      className: "w-[23rem] h-[5rem] px-5",
    });
  }

  async function deletePicture() {
    const {} = await supabase.storage
      .from("profilepicture")
      .remove([publicUserObject.profilPicture]);

    const {} = await supabase
      .from("public-user")
      .update({
        profilPicture: "",
      })
      .eq("userId", publicUserObject.userId);

    toast.success("Profilbild wurde erfolgreich gelöscht.", {
      unstyled: true,
      className: "w-[27rem] h-[5rem] px-5",
    });
  }

  async function loadPrivateUserData() {
    const { data } = await supabase.from("private-user").select();

    if (data?.length !== 0) {
      setPrivateDataExist(true);
      setPrivateUserArray(data!);
      setPrivateUserObject(data![0]);
      setCurrentPrivateUserId(data![0].id);
    } else {
      setPrivateDataExist(false);
      toast.info("Hinweis: Es existieren keine Adressdaten von dir.", {
        unstyled: true,
        className: "settings-notice-toasty w-[20rem] h-[5rem] px-5",
      });
    }
  }

  function inputCityName(cityName: string) {
    const cityNameWithoutSpace = cityName;
    setUpdateCityName(cityNameWithoutSpace.trimStart());

    if (cityNameWithoutSpace.trimStart().length > 0) {
      setMinimumSignCityName(true);
    }

    if (cityNameWithoutSpace === "") {
      setMinimumSignCityName(false);
    }
  }

  function inputStreetName(streetName: string) {
    const streetNameWithoutSpace = streetName;
    setUpdateStreetName(streetNameWithoutSpace.trimStart());

    if (streetNameWithoutSpace.trimStart().length > 0) {
      setMinimumSignStreetName(true);
    }

    if (streetNameWithoutSpace === "") {
      setMinimumSignStreetName(false);
    }
  }

  function inputHousenumber(houseNumber: string) {
    setUpdateHousenumber(Number(houseNumber));

    if (houseNumber !== "0") {
      setMinimumSignHousenumber(true);
    }

    if (houseNumber === "") {
      setMinimumSignHousenumber(false);
    }
  }

  function inputPLZ(plz: string) {
    const plzWithoutSpace = plz;
    setUpdatePLZ(plzWithoutSpace.trimStart());

    if (plzWithoutSpace.trimStart().length > 0) {
      setMinimumSignPLZ(true);
    }

    if (plzWithoutSpace === "") {
      setMinimumSignPLZ(false);
    }
  }

  function inputCountry(country: string) {
    const countryWithoutSpace = country;
    setUpdateCountry(countryWithoutSpace.trimStart());

    if (countryWithoutSpace.trimStart().length > 0) {
      setMinimumSignCountry(true);
    }

    if (countryWithoutSpace === "") {
      setMinimumSignCountry(false);
    }
  }

  function openPrivateUserPopUp(update: string) {
    if (update === "update") {
      setUpdateCityName(privateUserObject.city);
      setMinimumSignCityName(true);
      setUpdateStreetName(privateUserObject.street);
      setMinimumSignStreetName(true);
      setUpdateHousenumber(privateUserObject.houseNumber);
      setMinimumSignHousenumber(true);
      setUpdatePLZ(privateUserObject.PLZ);
      setMinimumSignPLZ(true);
      setUpdateCountry(privateUserObject.country);
      setMinimumSignCountry(true);
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
      return user.userId === currentSessionUserId;
    });

    if (findUser) {
      const {} = await supabase
        .from("private-user")
        .update({
          city: updateCityName,
          street: updateStreetName,
          houseNumber: updateHousenumber,
          PLZ: updatePLZ,
          country: updateCountry,
        })
        .eq("id", currentPrivateUserId);

      loadPrivateUserData();

      toast.success("Deine Adressdaten wurden erfolgreich geändert.", {
        unstyled: true,
        className: "settings-success-toasty w-[21rem] h-[5rem] px-5",
      });

      setEditPrivateUserDataPopUp(false);
      setMinimumSignCityName(false);
      setMinimumSignStreetName(false);
      setMinimumSignHousenumber(false);
      setMinimumSignPLZ(false);
      setMinimumSignCountry(false);
    } else {
      const {} = await supabase.from("private-user").insert({
        userId: currentSessionUserId,
        city: updateCityName,
        street: updateStreetName,
        houseNumber: updateHousenumber,
        PLZ: updatePLZ,
        country: updateCountry,
      });
      loadPrivateUserData();
      toast.success(
        "Deine neuen Adressdaten wurden erfolgreich in der Datenbank gespeichert.",
        {
          unstyled: true,
          className: "settings-success-toasty w-[30rem] h-[7rem] px-7",
        }
      );

      setEditPrivateUserDataPopUp(false);
      setPrivateDataExist(true);
      setMinimumSignCityName(false);
      setMinimumSignStreetName(false);
      setMinimumSignHousenumber(false);
      setMinimumSignPLZ(false);
      setMinimumSignCountry(false);
    }
  }

  async function opendeletePrivateUserDataPopUp() {
    const { data } = await supabase.from("private-user").select();

    if (data?.length !== 0) {
      setDeletePrivateUserDataPopUp(true);
    }
  }

  async function deletePrivateUserData(id: number) {
    const {} = await supabase.from("private-user").delete().eq("id", id);

    toast.success(
      "Deine Adressdaten wurden erfolgreich aus der Datenbank entfernt.",
      {
        unstyled: true,
        className: "settings-success-toasty w-[27rem] h-[7rem] px-5",
      }
    );

    setDeletePrivateUserDataPopUp(false);
    setPrivateDataExist(false);
    setMinimumSignCityName(false);
    setMinimumSignStreetName(false);
    setMinimumSignHousenumber(false);
    setMinimumSignPLZ(false);
    setMinimumSignCountry(false);
    setPrivateUserObject({
      ...privateUserObject,
      city: "",
      country: "",
      id: 0,
      PLZ: "",
      street: "",
      houseNumber: 0,
      userId: "",
    });
  }

  async function toUser() {
    setPrivateUserObject({
      ...privateUserObject,
      city: "",
      country: "",
      id: 0,
      PLZ: "",
      street: "",
      houseNumber: 0,
      userId: "",
    });
    setPrivateUserArray([]);
    setCurrentPrivateUserId(0);
    setCurrentSessionUserId("");
    navigation(`/private-route/user/${publicUserObject.userId}`);
  }

  async function deleteAccount() {
    const {} = await supabase
      .from("public-user")
      .delete()
      .eq("userId", publicUserObject.userId);

    const {} = await supabase
      .from("posts")
      .delete()
      .eq("userId", publicUserObject.userId);

    const {} = await supabase
      .from("comments")
      .delete()
      .eq("userId", publicUserObject.userId);

    const {} = await supabase
      .from("private-user")
      .delete()
      .eq("userId", publicUserObject.userId);

    const {} = await supabase
      .from("like-dislike-posts")
      .delete()
      .eq("userId", publicUserObject.userId);

    const {} = await supabase
      .from("like-dislike-comments")
      .delete()
      .eq("userId", publicUserObject.userId);

    const {} = await supabase
      .from("follow")
      .delete()
      .eq("userId", publicUserObject.userId);

    const {} = await supabase
      .from("follow")
      .delete()
      .eq("FollowUserId", publicUserObject.userId);

    const {} = await supabase.storage
      .from("profilepicture")
      .remove([publicUserObject.profilPicture]);

    const {} = await supabase.auth.signOut();

    setPublicUserObject({
      ...publicUserObject,
      Profilname: "",
      profilPicture: "",
      userId: "",
      AGBConsent: false,
      dataProtectionConsent: false,
      userDataConsent: false,
    });

    setUserAuthObject({
      ...userAuthObject,
      accessToken: "",
    });

    setDeleteAccountPopUp(false);

    navigation("/");

    const {} = await supabase.auth.admin.deleteUser(publicUserObject.userId);
  }

  async function logOutReturnConsent() {
    const {} = await supabase
      .from("public-user")
      .update({
        AGBConsent: false,
        dataProtectionConsent: false,
        userDataConsent: false,
      })
      .eq("userId", publicUserObject.userId);

    const {} = await supabase.auth.signOut();

    setPublicUserObject({
      ...publicUserObject,
      Profilname: "",
      userId: "",
      AGBConsent: false,
      dataProtectionConsent: false,
      userDataConsent: false,
    });

    setUserAuthObject({
      ...userAuthObject,
      accessToken: "",
    });
    navigation("/");
  }

  function toSignIn() {
    navigation("/");
  }

  return (
    <section className="settings-section">
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
      <nav className="settings-nav-bar my-15 flex justify-around items-center">
        <button onClick={toUser} className="to-user-link cursor-pointer">
          <svg
            xmlns="http://www.w5.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="to-user-icon w-13"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h1 className="settings-headline text-4xl">Einstellungen</h1>
        <button
          onClick={toSignIn}
          className="logout-button px-3 flex flex-col items-center justify-center hover:text-blue-400 rounded-sm cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="logout-icon w-13"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
            />
          </svg>
          <span className="interaction-label text-lg">Ausloggen</span>
        </button>
      </nav>
      <div className="settings-status-text-div mx-auto my-5 flex flex-col items-center justify-center gap-y-5">
        <textarea
          name=""
          value={statusText}
          onChange={(event) => {
            setStatusText(event.target.value);
          }}
          placeholder="Statustext eingeben..."
          className="settings-status-textarea w-[40rem] h-[10rem] px-3 py-1 text-lg border border-gray-300 rounded-sm resize-none"
        ></textarea>
        <div className="settings-status-button-div flex justify-center items-center gap-x-5">
          <button
            onClick={updateStatustext}
            className="settings-status-update-button px-7 py-1.5 text-lg bg-blue-500 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-500 hover:border-blue-500"
          >
            Statustext updaten
          </button>
          <button
            onClick={delteStatustext}
            className="settings-status-delete-button px-7 py-1.5 text-lg flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500"
          >
            Statustext löschen
          </button>
        </div>
      </div>
      <div className="settings-generally-data-div mt-15 flex flex-col items-start justify-center">
        <p className="settings-generally-data-div-headline ml-[15%] text-[1.7rem]">
          Allgemeine Infos
        </p>{" "}
        <div className="settings-generally-data-main-div mx-auto px-20 py-10 flex flex-col items-center justify-center gap-y-7 bg-gray-50 border border-gray-400 rounded-sm shadow-lg">
          <div className="edit-profil-name-div flex justify-center items-center gap-x-5">
            <input
              type="text"
              value={updateProfilname}
              onChange={(event) => {
                setUpdateProfilname(event.target.value);
              }}
              name=""
              className="settings-generally-data-div-input pl-5 py-1.5 text-lg bg-white border border-gray-400 rounded-sm"
              placeholder="Profilnamen eingeben"
            />
            <button
              onClick={() => {
                editProfilname(publicUserObject.id, publicUserObject.userId);
              }}
              className="edit-profil-name-button px-5 py-1.5 text-lg bg-blue-500 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-500 hover:border-blue-500"
            >
              Profilnamen ändern
            </button>
          </div>{" "}
          <div className="edit-password-div flex justify-center items-center gap-x-5">
            <input
              type="text"
              value={updatePassword}
              onChange={(event) => {
                setUpdatePassword(event.target.value);
              }}
              name=""
              className="settings-generally-data-div-input pl-5 py-1.5 text-lg bg-white border border-gray-400 rounded-sm"
              placeholder="Passwort eingeben"
            />
            <button
              onClick={editPasswort}
              className="edit-password-button px-8 py-1.5 text-lg bg-blue-500 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-500 hover:border-blue-500"
            >
              Passwort ändern
            </button>
          </div>
          <div className="settings-generally-data-div-picture-div flex flex-col items-center justify-center gap-x-3">
            <input
              type="file"
              onChange={(event) => {
                const target = event.target as HTMLInputElement;
                const file = target.files?.[0] ?? null;
                setUpdateAvatarFile(file);
              }}
              className="settings-generally-data-div-picture-input w-full bg-white text-base text-gray-700
        file:me-4 file:py-2 file:px-4
        file:rounded-sm file:border-0
        file:text-base 
        file:bg-blue-500 file:text-white
        hover:file:bg-white hover:file:border-blue-500 hover:file:text-blue-500
        file:disabled:opacity-50 file:disabled:pointer-events-none
       cursor-pointer border border-gray-200 rounded-sm"
              name=""
            />
            <div className="picture-button-div mt-5 flex justify-center items-center gap-x-5">
              <button
                onClick={updateProfilPicture}
                className="update-picture-button px-7 py-1.5 text-lg bg-blue-500 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-500 hover:border-blue-500"
              >
                Profilbild updaten
              </button>
              <button
                onClick={deletePicture}
                className="delete-picture-button px-7 py-1.5 text-lg flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500"
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
          className="edit-private-user-popup w-full"
        >
          <DialogHeader>
            <DialogDescription className="edit-private-user-popup-description">
              <div className="mt-5 flex flex-col gap-y-5">
                {" "}
                <p className="mx-auto my-2 text-black text-[22px]">
                  Alle Felder sind Freiwillig.
                </p>
                <input
                  type="text"
                  value={updateCityName}
                  onChange={(event) => {
                    inputCityName(event.target.value);
                  }}
                  className="edit-private-user-popup-input w-[17rem] mx-auto px-3 py-1 text-lg border border-gray-400 rounded-sm"
                  name=""
                  placeholder="Stadt eingeben"
                />{" "}
                <input
                  type="text"
                  value={updateStreetName}
                  onChange={(event) => {
                    inputStreetName(event.target.value);
                  }}
                  className="edit-private-user-popup-input w-[17rem] mx-auto px-3 py-1 text-lg border border-gray-400 rounded-sm"
                  name=""
                  placeholder="Straße eingeben"
                />
                <input
                  type="number"
                  value={updateHousenumber !== 0 ? updateHousenumber : ""}
                  onChange={(event) => {
                    inputHousenumber(event.target.value);
                  }}
                  className="edit-private-user-popup-input w-[17rem] mx-auto px-3 py-1 text-lg border border-gray-400 rounded-sm"
                  name=""
                  placeholder="Hausnummer eingeben"
                />
                <input
                  type="number"
                  value={Number(updatePLZ) !== 0 ? updatePLZ : ""}
                  onChange={(event) => {
                    inputPLZ(event.target.value);
                  }}
                  className="edit-private-user-popup-input w-[17rem] mx-auto px-3 py-1 text-lg border border-gray-400 rounded-sm"
                  name=""
                  placeholder="PLZ eingeben"
                />
                <input
                  type="text"
                  value={updateCountry}
                  onChange={(event) => {
                    inputCountry(event.target.value);
                  }}
                  className="edit-private-user-popup-input w-[17rem] mx-auto  px-3 py-1 text-lg border border-gray-400 rounded-sm"
                  name=""
                  placeholder="Land eingeben"
                />
              </div>
              <div className="edit-private-user-popup-button-div mt-10 mb-3 flex justify-end items-center gap-x-5">
                <button
                  onClick={() => {
                    setEditPrivateUserDataPopUp(false);
                    setMinimumSignCityName(false);
                    setMinimumSignStreetName(false);
                    setMinimumSignHousenumber(false);
                    setMinimumSignPLZ(false);
                    setMinimumSignCountry(false);
                  }}
                  className="edit-private-user-popup-close-button px-3 py-1 text-lg flex justify-center items-center bg-gray-50 text-black border border-gray-200 rounded-sm cursor-pointer hover:bg-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6"
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
                    minimumSignCityName === true &&
                    minimumSignStreetName === true &&
                    minimumSignHousenumber == true &&
                    minimumSignPLZ === true &&
                    minimumSignCountry === true
                      ? false
                      : true
                  }
                  className={`edit-private-user-popup-new-user-data-button ${
                    privateDataExist === false ? "" : "hidden"
                  } ${
                    minimumSignCityName === true &&
                    minimumSignStreetName === true &&
                    minimumSignHousenumber == true &&
                    minimumSignPLZ === true &&
                    minimumSignCountry === true
                      ? "bg-blue-400 text-white border border-white hover:bg-white hover:text-blue-400 hover:border-blue-400 cursor-pointer"
                      : "bg-gray-300"
                  } px-5 py-1 text-lg flex justify-center items-center gap-x-1 rounded-sm`}
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  Daten erstellen
                </button>
                <button
                  onClick={updatePrivateUserData}
                  disabled={
                    minimumSignCityName === true &&
                    minimumSignStreetName === true &&
                    minimumSignHousenumber == true &&
                    minimumSignPLZ === true &&
                    minimumSignCountry === true
                      ? false
                      : true
                  }
                  className={`edit-private-user-popup-update-user-data-button ${
                    privateDataExist === true ? "" : "hidden"
                  } ${
                    minimumSignCityName === true &&
                    minimumSignStreetName === true &&
                    minimumSignHousenumber == true &&
                    minimumSignPLZ === true &&
                    minimumSignCountry === true
                      ? "bg-blue-400 text-white border border-white hover:bg-white hover:text-blue-400 hover:border-blue-400 cursor-pointer"
                      : "bg-gray-300"
                  } px-5 py-1 text-lg flex justify-center items-center gap-x-1 rounded-sm`}
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6"
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
          className="delete-private-user-popup"
        >
          <DialogHeader>
            <DialogDescription className="delete-private-user-popup-description p-5 text-black flex flex-col gap-10">
              <p className="delete-private-user-popup-note text-[18px]">
                Möchtest du deine Adressdaten wirklick löschen?
              </p>
              <div className="delete-private-user-popup-button-div w-full flex justify-end items-center gap-x-3">
                <button
                  onClick={() => {
                    setDeletePrivateUserDataPopUp(false);
                  }}
                  className="delete-private-user-popup-close-button px-3 py-1 text-[18px] flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 cursor-pointer rounded-sm hover:bg-white"
                >
                  schließen
                </button>
                <button
                  onClick={() => {
                    deletePrivateUserData(privateUserObject.id);
                  }}
                  className="delete-private-user-popup-delete-button px-5 py-1 text-lg flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6"
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
      <div className="private-data-div mt-15 py-5 flex flex-col items-start justify-center">
        <p className="private-data-div-headline text-2xl ml-[15%] my-5">
          Private Infos
        </p>
        <button
          onClick={loadPrivateUserData}
          className="private-data-div-load-button ml-[15%] px-5 py-1.5 text-lg bg-blue-500 text-white border border-white rounded-sm cursor-pointer hover:bg-white hover:text-blue-500 hover:border-blue-500"
        >
          Daten laden
        </button>
        <div className="private-data-overview-div w-full mt-7 mx-auto flex flex-col justify-around items-center gap-y-3">
          <div className="private-data-div-table bg-gray-50 shadow-lg">
            <div className="table-headline-div">
              <th className="table-head-title w-[200px] py-1 text-lg border border-gray-400">
                Stadt
              </th>
              <th className="table-head-title w-[200px] py-1 text-lg border border-gray-400">
                Straße
              </th>
              <th className="table-head-title w-[200px] py-1 text-lg border border-gray-400">
                Hausnummer
              </th>
              <th className="table-head-title w-[200px] py-1 text-lg border border-gray-400">
                PLZ
              </th>
              <th className="table-head-title w-[200px] py-1 text-lg border border-gray-400">
                Land
              </th>
            </div>
            <div className="table-info-div">
              <td className="private-data-div-info w-[200px] px-3 text-[17px] bg-white border border-gray-400">
                {privateUserObject.city}
              </td>
              <td className="private-data-div-info w-[200px] px-3 text-[17px] bg-white border border-gray-400">
                {privateUserObject.street}
              </td>
              <td className="private-data-div-info number w-[200px] h-[40px] px-3 text-[17px] text-right bg-white border border-gray-400">
                {privateUserObject.houseNumber !== 0
                  ? privateUserObject.houseNumber
                  : ""}
              </td>
              <td className="private-data-div-info number w-[200px] px-3 text-[17px] text-right bg-white border border-gray-400">
                {privateUserObject.PLZ}
              </td>
              <td className="private-data-div-info w-[200px] px-3 text-[17px] bg-white border border-gray-400">
                {privateUserObject.country}
              </td>
            </div>
          </div>
          <div className="private-user-data-div-button-div mt-5 flex justify-center items-center gap-x-5">
            <button
              onClick={() => {
                openPrivateUserPopUp("");
              }}
              className={`${
                privateDataExist === false
                  ? "bg-blue-500 text-white border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500 cursor-pointer"
                  : "bg-gray-300 hover:bg-gray-300 text-white hover:text-white hover:border-white"
              } create-private-data-button px-5 py-2 flex justify-center items-center gap-x-1 text-lg rounded-sm`}
              disabled={privateDataExist}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Daten erstellen
            </button>
            <button
              onClick={() => {
                openPrivateUserPopUp("update");
              }}
              disabled={!privateDataExist}
              className={`update-private-data-button px-5 py-2 flex justify-center items-center gap-x-1 text-lg rounded-sm ${
                privateDataExist === true
                  ? "bg-blue-500 text-white border border-white hover:bg-white hover:text-blue-500 hover:border-blue-500 cursor-pointer"
                  : "bg-gray-300 text-white hover:bg-gray-300 hover:text-white hover:border-white "
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6"
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
              className={`delete-private-data-button px-5 py-2 text-lg flex justify-center items-center gap-x-1 border rounded-sm ${
                privateDataExist === true
                  ? "bg-red-500 text-white hover:bg-white hover:text-red-500 hover:border-red-500 cursor-pointer"
                  : "bg-gray-300 hover:bg-gray-300 text-white hover:text-gray-50 hover:border-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6"
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
          className="return-consent-popup"
        >
          <DialogHeader>
            <DialogDescription className="return-consent-popup-description p-5 text-black flex flex-col gap-10">
              <span className="return-consent-popup-content  text-[24px] text-red-500">
                Achtung
              </span>
              <span className="return-consent-popup-content text-[20px]">
                Einwilligung zurückgezogen
              </span>
              <p className="return-consent-popup-content text-[18px]">
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
              <div className="return-consent-popup-button-div w-full flex justify-end items-center gap-x-3">
                <button
                  onClick={() => {
                    setAGBConsent(true);
                    setDataprotectionConsent(true);
                    setUserDataConsent(true);
                    setReturnConsentPopUp(false);
                  }}
                  className="return-consent-popup-close-button px-3 py-1 text-[18px] flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 cursor-pointer rounded-sm hover:bg-white"
                >
                  Nein schließen
                </button>
                <button
                  onClick={logOutReturnConsent}
                  className="return-consent-popup-logout-button px-5 py-1 text-lg flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500"
                >
                  Ja ausloggen
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="settings-return-consent-div mx-auto mt-20">
        <h2 className="settings-return-consent-div-headline ml-[15rem] text-3xl">
          Widerrufsrecht und Einwilligung
        </h2>
        <div className="settings-agb-div flex flex-col items-start justify-center gap-y-3">
          <h2 className="settings-agb-div-headline ml-[15rem] mt-10 mb-5 text-2xl">
            Allgemine Geschäftsbedingungen
          </h2>
          <div className="settings-agb-overview w-[75%] h-[500px] mx-auto border border-gray-400 rounded-sm overflow-hidden">
            <div className="settings-agb-overview-scroll-div w-full h-full px-7 py-5 overflow-y-scroll">
              <AGBComponent />
            </div>
          </div>
          <div className="settings-agb-accept-div w-ful mt-1 text-lg flex justify-start items-center gap-x-3">
            <input
              type="checkbox"
              checked={agbConsent}
              onChange={(event) => {
                setAGBConsent(event.target.checked);
                setReturnConsentPopUp(true);
              }}
              className="settings-agb-input-checkbox ml-[15rem] cursor-pointer"
              name=""
            />{" "}
            Akzeptieren
          </div>
        </div>

        <div className="settings-data-protection-div flex flex-col items-start justify-center gap-y-5">
          <h2 className="settings-data-protection-headline ml-[15rem] mt-10 mb-5 text-2xl">
            Datenschutzerklärung
          </h2>
          <div className="settings-data-protection-overview w-[75%] h-[500px] mx-auto px-7 py-5 border border-gray-400 rounded-sm overflow-y-scroll">
            <DataprotectionComponent />
          </div>
          <div className="settings-data-protection-accept-div w-ful mt-1 text-lg flex justify-start items-center gap-x-3">
            <input
              type="checkbox"
              checked={dataprotectionConsent}
              onChange={(event) => {
                setDataprotectionConsent(event.target.checked);
                setReturnConsentPopUp(true);
              }}
              className="settings-data-protection-input-checkbox ml-[15rem] cursor-pointer"
              name=""
            />
            Akzeptieren
          </div>
        </div>

        <div className="settings-user-consent-div flex flex-col items-start justify-center gap-y-5">
          <h2 className="settings-user-consent-headline ml-[15rem] mt-10 mb-5 text-2xl">
            Einwilligung zur Datenverarbeitung <wbr /> durch Drittanbieter
          </h2>
          <div className="settings-user-consent-text w-[75%] mx-auto p-5 text-lg border border-gray-400 rounded-sm">
            Ich willige ein, dass meine freiwilligen angegebenen
            personenbezogenen Daten (z.B. Adresse, Stadt, Telefonnummer), im
            Rahmen der Nutzung der Plattform OpenPureNet, an den Dienstleister
            SupaBase Inc. übermittelt und dort gemäß deren
            Datenschutzrichlinenen gespeichert und verarbeitet werden. Die
            Datenverarbeitung dient ausschließlich der technischen
            Bereitstellung und Sicherheit meines Nutzerkontos. Ich kann diese
            Einwilligung jederzeit widerrufen.
          </div>
          <div className="settings-user-consent-accept-div w-ful mt-1 text-lg flex justify-start items-center gap-x-3">
            <input
              type="checkbox"
              checked={userDataConsent}
              onChange={(event) => {
                setUserDataConsent(event.target.checked);
                setReturnConsentPopUp(true);
              }}
              className="settings-user-consent-input-checkbox ml-[15rem] cursor-pointer"
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
          className="delete-account-popup !max-w-xl"
        >
          <DialogHeader>
            <DialogDescription className="delete-account-popup-description p-5 text-black flex flex-col gap-10">
              <p className="delete-account-popup-content text-[18px]">
                Achtung
                <br />
                <br />
                Du bist gerade dabei deinen Account zu löschen.
                <br />
                <br />
                Bist du dir sicher das du deinen Account löschen möchtest?
              </p>
              <div className="delete-account-popup-button-div w-full flex justify-end items-center gap-x-3">
                <button
                  onClick={() => {
                    setDeleteAccountPopUp(false);
                  }}
                  className="delete-account-popup-close-button px-3 py-1 text-[18px] flex justify-center items-center gap-x-1 bg-gray-50 border border-gray-200 cursor-pointer rounded-sm hover:bg-white"
                >
                  Nein Account nicht löschen
                </button>
                <button
                  onClick={deleteAccount}
                  className="delete-account-popup-delete-button px-5 py-1 text-lg flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500"
                >
                  Ja Account löschen
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <button
        onClick={() => {
          setDeleteAccountPopUp(true);
        }}
        className="settings-delete-user-account ml-[15rem] my-15 px-5 py-1 text-lg flex justify-center items-center gap-x-1 bg-red-500 text-white border rounded-sm cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500"
      >
        Account löschen
      </button>
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
