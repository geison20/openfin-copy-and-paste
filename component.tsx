import React, { useState } from "react";
import { Typography, TextField } from "@mui/material";

const EditableTitle = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("Clique aqui para editar");

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (e) => {
    setTitle(e.target.value);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div>
      {isEditing ? (
        <TextField
          variant="outlined"
          value={title}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <Typography variant="h6" onDoubleClick={handleDoubleClick}>
          {title}
        </Typography>
      )}
    </div>
  );
};

export default EditableTitle;
