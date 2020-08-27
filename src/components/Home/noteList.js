import React from "react";

import NoteItem from "./noteItem";

const NoteList = ({ notes, onRemoveNote, onEditNote, authUser }) => (
  <ul>
    {notes.map((note) => (
      <NoteItem
        authUser={authUser}
        onRemoveNote={onRemoveNote}
        onEditNote={onEditNote}
        key={note.uid}
        note={note}
      />
    ))}
  </ul>
);

export default NoteList;
