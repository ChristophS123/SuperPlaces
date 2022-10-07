import { Alert, Box, Container, Stack } from "@mui/material";
import { useSupabase } from "./hooks/useSupabase";
import { Place } from "./Place";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { supabase } from "./supabase";
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface SupabaseData {
  name: string;
  description: string;
  coordinates: string;
  image: string;
  room: string;
  id: string;
  created_at: string;
  created_from: string;
}

export const Placelist = () => {
  const { data, push, remove, update } = useSupabase<SupabaseData>("christoph");
  console.log({ data });
  // remove({id: "123"})
  // update({text: "adgadg"}, {id: "123"})

  const [openNewPlaceMenu, setOpenNewPlaceMenu] = React.useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null);
  const MainMenuOpen = Boolean(openMenu);
  const [openLogInMenu, setOpenLogInMenu] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState("");
  const [openRegisterMenu, setOpenRegisterMenu] = useState(false);

  const [tutorialOpen, setTutorialOpen] = useState(false);

  const [openSearchMenu, setOpenSearchMenu] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const [searchText, setSearchText] = useState("");

  const [openSuccesSnackbar, setOpenSuccesSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const [succesSnackbarText, setSuccesSnackbarText] = useState("Erfolg!");
  const [errorSnackbarText, setErrorSnackbarText] = useState("Fehlgeschlagen!");

  const [searcher, setSearcher] = useState("");

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentCoordinates(
        position.coords.latitude.toString() +
          "N" +
          " " +
          position.coords.longitude.toString() +
          "E"
      );
    });
  });

  function handleErrorSnackbarClick() {
    setOpenErrorSnackbar(true);
  }

  const handleClickOpenPlaceMenu = () => {
    if (currentUserEmail !== "") setOpenNewPlaceMenu(true);
    else {
      setErrorSnackbarText("Bitte melde dich an, um einen Ort zu erstellen.");
      handleErrorSnackbarClick();
    }
  };

  const handleClickOpenRegisterMenu = () => {
    if (currentUserEmail !== "") {
      setErrorSnackbarText(
        "Du bist bereits als " + currentUserEmail + " eingeloggt."
      );
      handleErrorSnackbarClick();
      return;
    }
    setOpenRegisterMenu(true);
  };

  function handleSuccesSnackbarClick() {
    setOpenSuccesSnackbar(true);
  }

  const onEmailClick = () => {
    setSuccesSnackbarText("Angemeldet als " + currentUserEmail);
    handleSuccesSnackbarClick();
  };

  const handleSuccesSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccesSnackbar(false);
  };

  const handleErrorSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenErrorSnackbar(false);
  };

  const handleSignOut = () => {
    if (currentUserEmail === "gast@email.com") {
      setCurrentUserEmail("");
      setSuccesSnackbarText("Du wurdest ausgeloggt.");
      handleSuccesSnackbarClick();
      return;
    }
    if (currentUserEmail !== "") {
      supabase.auth.signOut();
      setCurrentUserEmail("");
      setSuccesSnackbarText("Du wurdest ausgeloggt.");
      handleSuccesSnackbarClick();
    } else {
      setErrorSnackbarText("Du bist nicht angemeldet.");
      handleErrorSnackbarClick();
    }
  };

  const handleBreakRegisterMenu = () => {
    setOpenRegisterMenu(false);
  };

  const HandleMainMenuClose = () => {
    setOpenMenu(null);
  };

  const handleBreakLogInMenu = () => {
    setOpenLogInMenu(false);
  };

  const handleOpenLogInMenu = () => {
    if (currentUserEmail !== "") {
      setErrorSnackbarText(
        "Du bist bereits als " + currentUserEmail + " angemeldet."
      );
      handleErrorSnackbarClick();
      return;
    }
    setOpenLogInMenu(true);
  };

  const handlePlaceSearch = () => {
    setOpenSearchMenu(true);
  };

  const resetSearch = () => {
    // window.location.href = window.location.href;
    setSearcher("");
  };

  const handleSearchMenuClose = () => {
    setOpenSearchMenu(false);
  };

  const searchItems = () => {
    setSearcher(searchText);
    setOpenSearchMenu(false);
  };

  const handleTutorialClose = () => {
    setTutorialOpen(false);
  };

  const handleTutorialOpen = () => {
    setTutorialOpen(true);
    setOpenMenu(null);
  };

  const logInUser = async () => {
    const email = loginEmail;
    const password = loginPassword;
    if (email === "gast@email.com" && password === "gast") {
      setCurrentUserEmail("gast@email.com");
      setSuccesSnackbarText("Du hast dich als Gast angemeldet.");
      handleSuccesSnackbarClick();
      setOpenLogInMenu(false);
      return;
    }
    if (email !== "" && password !== "") {
      try {
        const { error } = await supabase.auth.signIn({
          email: email,
          password: password
        });
        if (error) {
          console.log(error);
          setErrorSnackbarText(
            "Dein(e) Passwort / Email ist falsch, oder du hast dich noch nicht verifiziert. Checke deine Emails."
          );
          handleErrorSnackbarClick();
          return;
        } else {
          setCurrentUserEmail(email);
        }
      } catch (error) {
        setErrorSnackbarText(
          "Dein(e) Passwort / Email ist falsch, oder du hast dich noch nicht verifiziert. Checke deine Emails."
        );
        handleErrorSnackbarClick();
      }
    } else {
      setErrorSnackbarText("Bitte gebe alle Daten ein.");
      handleErrorSnackbarClick();
      return;
    }
    setOpenLogInMenu(false);
    setSuccesSnackbarText("Du hast dich erfolgreich eingeloggt.");
    handleSuccesSnackbarClick();
  };

  const registerNewUser = async () => {
    const name = registerName;
    const email = registerEmail;
    const password = registerPassword;
    if (name !== "" && email !== "" && password !== "") {
      try {
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password
        });
        if (error) {
          console.log(error);
          setErrorSnackbarText(
            "Ein Benutzer mit dieser Email Adresse exestiert bereits. Melde dich an!"
          );
          handleErrorSnackbarClick();
          return;
        }
      } catch (error) {
        setErrorSnackbarText(
          "Ein Benutzer mit dieser Email Adresse exestiert bereits."
        );
        handleErrorSnackbarClick();
      }
    } else {
      setErrorSnackbarText("Dazu musst du angemeldet sein.");
      handleErrorSnackbarClick();
      return;
    }
    setOpenRegisterMenu(false);
    setSuccesSnackbarText(
      "Du hast dich erfolgreich registriert. Checke deine Emails!"
    );
    handleSuccesSnackbarClick();
  };

  const handleTutorialClick = () => {};

  const handleMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setOpenMenu(event.currentTarget);
  };

  const handleClosePlaceMenu = () => {
    if (name !== "" && description !== "") {
      push({
        name: name,
        description: description,
        image: url,
        coordinates: coordinates,
        created_from: currentUserEmail
      });
      window.location.href = window.location.href;
    } else {
      setErrorSnackbarText("Es müssen alle Textfelder ausgefüllt sein.");
      handleErrorSnackbarClick();
      return;
    }
    setOpenNewPlaceMenu(false);
  };

  const handleCloseBreakNewPlaceMenu = () => {
    setOpenNewPlaceMenu(false);
  };

  return (
    <div>
      <div className="Header">
        <Container>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <h1 className="Title">Super Places</h1>

            {currentUserEmail !== "" ? (
              <h2 onClick={onEmailClick} className="EmailClicker">
                {currentUserEmail[0] +
                  currentUserEmail[1] +
                  currentUserEmail[2] +
                  currentUserEmail[3] +
                  currentUserEmail[4] +
                  "..."}
              </h2>
            ) : (
              <h2></h2>
            )}

            <IconButton
              aria-label="more"
              id="MenuButton"
              onClick={handleMenuButtonClick}
              aria-controls={MainMenuOpen ? "MainMenu" : undefined}
              aria-expanded={MainMenuOpen ? "true" : undefined}
              aria-haspopup="true"
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              MenuListProps={{
                "aria-labelledby": "MenuButton"
              }}
              onClose={HandleMainMenuClose}
              open={MainMenuOpen}
              id="MainMenu"
              anchorEl={openMenu}
            >
              <MenuItem onClick={handleClickOpenRegisterMenu}>
                Registrieren
              </MenuItem>
              <MenuItem onClick={handleOpenLogInMenu}>Einloggen</MenuItem>
              <MenuItem onClick={handleSignOut}>Abmelden</MenuItem>
              <MenuItem>—————————————</MenuItem>
              <MenuItem onClick={handleClickOpenPlaceMenu}>
                Ort erstellen
              </MenuItem>
              <MenuItem onClick={handlePlaceSearch}>Suchen</MenuItem>
              <MenuItem onClick={handleTutorialOpen}>Tutorial</MenuItem>
            </Menu>
          </Stack>
        </Container>
      </div>
      <Container>
        {data &&
          data.map((place) => {
            if (
              !place.name.includes(searcher) &&
              !place.description.includes(searcher)
            ) {
              if (searcher !== "") return;
            }
            if (place.created_from === currentUserEmail) {
              return (
                <Place
                  coordinates={place.coordinates}
                  description={place.description}
                  image={place.image}
                  created_from={place.created_from}
                  canDelete={true}
                  onDeleteButtonClick={() => {
                    remove({ id: place.id });
                  }}
                >
                  {place.name}
                </Place>
              );
            } else {
              return (
                <Place
                  coordinates={place.coordinates}
                  description={place.description}
                  image={place.image}
                  created_from={place.created_from}
                  canDelete={false}
                >
                  {place.name}
                </Place>
              );
            }
          })}
      </Container>
      <div className="AddNewPlace"></div>

      {/*New Place Menu*/}
      <Dialog open={openNewPlaceMenu} onClose={handleCloseBreakNewPlaceMenu}>
        <DialogTitle>Neuer Ort</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Name"
            fullWidth
            variant="standard"
            onChange={(event) => setName(event.target.value)}
          />

          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Beschreibung"
            fullWidth
            variant="standard"
            onChange={(event) => setDescription(event.target.value)}
          />

          <Stack direction="row">
            <TextField
              autoFocus
              margin="dense"
              id="url"
              label="Bild URL"
              fullWidth
              variant="standard"
              onChange={(event) => setURL(event.target.value)}
            />
            <Button>
              <a
                href={
                  "https://www.google.com/search?q=" +
                  name +
                  "&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjVm_CP1836AhXSg_0HHar2BTYQ_AUoAXoECAEQAw&cshid=1665130707492215&biw=1920&bih=969&dpr=1"
                }
              >
                Suchen
              </a>
            </Button>
          </Stack>

          <TextField
            autoFocus
            margin="dense"
            id="coordinates"
            label="Koordinaten"
            fullWidth
            value={currentCoordinates}
            variant="standard"
            onChange={(event) => setCoordinates(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBreakNewPlaceMenu}>Abbrechen</Button>
          <Button onClick={handleClosePlaceMenu}>Erstellen</Button>
        </DialogActions>
      </Dialog>
      {/*New Place Menu*/}

      {/*Register Menu*/}
      <Dialog open={openRegisterMenu} onClose={handleBreakRegisterMenu}>
        <DialogTitle>Registrieren</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="registerName"
            label="Name"
            fullWidth
            variant="standard"
            onChange={(event) => setRegisterName(event.target.value)}
          />

          <TextField
            autoFocus
            margin="dense"
            id="registerEmail"
            label="Email Adresse"
            fullWidth
            variant="standard"
            onChange={(event) => setRegisterEmail(event.target.value)}
          />

          <TextField
            autoFocus
            margin="dense"
            id="registerPassword"
            label="Passwort"
            type="password"
            fullWidth
            variant="standard"
            onChange={(event) => setRegisterPassword(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBreakRegisterMenu}>Abbrechen</Button>
          <Button onClick={registerNewUser}>Registrieren</Button>
        </DialogActions>
      </Dialog>
      {/*Register Menu*/}

      {/*Log In Menu*/}
      <Dialog open={openLogInMenu} onClose={handleBreakLogInMenu}>
        <DialogTitle>Einloggen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="loginEmail"
            label="Email Adresse"
            fullWidth
            variant="standard"
            onChange={(event) => setLoginEmail(event.target.value)}
          />

          <TextField
            autoFocus
            margin="dense"
            id="loginPassword"
            label="Passwort"
            fullWidth
            type="password"
            variant="standard"
            onChange={(event) => setLoginPassword(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBreakLogInMenu}>Abbrechen</Button>
          <Button onClick={logInUser}>Einloggen</Button>
        </DialogActions>
      </Dialog>
      {/*Log In Menu*/}

      {/*Search Menu*/}
      <Dialog open={openSearchMenu} onClose={handleSearchMenuClose}>
        <DialogTitle>Suchen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="search"
            label="Suche..."
            fullWidth
            variant="standard"
            onChange={(event) => setSearchText(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSearchMenuClose}>Abbrechen</Button>
          <Button onClick={searchItems}>Suchen</Button>
          <Button onClick={resetSearch}>Suche zurücksetzen</Button>
        </DialogActions>
      </Dialog>
      {/*Search Menu*/}

      {/*SuccesSnackbar*/}
      <Snackbar
        open={openSuccesSnackbar}
        autoHideDuration={6000}
        onClose={handleSuccesSnackbarClose}
      >
        <Alert
          onClose={handleSuccesSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {succesSnackbarText}
        </Alert>
      </Snackbar>
      {/*SuccesSnackbar*/}

      {/*ErrorSnackbar*/}
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleErrorSnackbarClose}
      >
        <Alert
          onClose={handleErrorSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorSnackbarText}
        </Alert>
      </Snackbar>
      {/*ErrorSnackbar*/}

      {/*Tutorial Dialog*/}
      <Dialog
        open={tutorialOpen}
        keepMounted
        onClose={handleTutorialClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Super Places ist eine Art Social Media für Orte. Du kannst deine
            lieblings Orte erstellen und Orte von anderen Benutzern sehen und
            diese eventuell besuchen.
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      {/*Tutorial Dialog*/}
    </div>
  );
};
