import React, { Component } from "react";
import styles from "./styles.module.css";

export default class NoteItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.note,
      visible: false,
    };
  }

  onChangeEditText = (e) => {
    this.setState({ editText: e.target.value });
  };

  onToggleEditMode = () => {
    this.setState((state) => ({
      editMode: !state.editMode,
      editText: this.props.note.text,
    }));
  };

  onSaveEditText = () => {
    this.props.onEditNote(this.props.note, this.state.editText);
    this.setState({ editMode: false });
  };

  setVisible = () => {
    this.setState((state) => ({
      visible: !state.visible,
    }));
  };

  render() {
    const { note, onRemoveNote, authUser } = this.props;
    const { editMode, editText, visible } = this.state;

    return (
      <li className={styles.noteItem}>
        {editMode ? (
          <textarea
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
            rows="5"
            cols="20"
          />
        ) : (
          <span className={styles.noteText}>
            <h1>{note.title}</h1>
            <small
              onClick={this.setVisible}
              className={visible ? styles.notActive : styles.active}
            >
              Click to{" "}
              <span role="img" aria-label="notebook-open">
                📖
              </span>
            </small>
            <span className={visible ? styles.active : styles.notActive}>
              <p>{note.text}</p>
              <small
                onClick={this.setVisible}
                className={visible ? styles.active : styles.notActive}
              >
                Click to{" "}
                <span role="img" aria-label="notebook-close">
                  📓
                </span>
              </small>
            </span>
          </span>
        )}
        {authUser.uid === note.userId && visible && (
          <span className={styles.btnContainer}>
            {editMode ? (
              <span className={styles.btnContainer}>
                <button onClick={this.onSaveEditText}>Save</button>
                <button onClick={this.onToggleEditMode}>Reset</button>
              </span>
            ) : (
              <button onClick={this.onToggleEditMode}>Edit</button>
            )}
            {!editMode && (
              <button type="button" onClick={() => onRemoveNote(note.uid)}>
                Delete
              </button>
            )}
          </span>
        )}
      </li>
    );
  }
}
