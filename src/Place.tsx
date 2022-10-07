import { Box, Stack, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const Place = (props) => {
  const {
    image,
    description,
    coordinates,
    created_at,
    created_from,
    canDelete,
    onDeleteButtonClick
  } = props;

  let link = "https://www.google.de/maps/place/" + coordinates + "/";

  return (
    <Box className="PlaceItem">
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <h1 className="PlaceItemTitle"> {props.children} </h1>
          {canDelete ? (
            <IconButton
              className="DeleteButton"
              color="warning"
              size="large"
              onClick={onDeleteButtonClick}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <h1></h1>
          )}
        </Stack>
        <i>{description}</i>
        <i>
          {" "}
          <a className="PlaceItemLink" href={link}>
            Zu Google Maps
          </a>
        </i>
        <Box>
          <img
            className="PlaceItemImage"
            src={image}
            height="300"
            width="300"
            alt={props.children}
          />
        </Box>
        <div className="CreatedFrom">
          Von <b>{created_from}</b>
        </div>
      </Stack>
    </Box>
  );
};
