import React from "react";
import styles from "./styles.module.css";
import NoteItem from "./noteItem";

const NoteList = ({ notes, onRemoveNote, onEditNote, authUser }) => (
  <ul className={styles.notesList}>
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
