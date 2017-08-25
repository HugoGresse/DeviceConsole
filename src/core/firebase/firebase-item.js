import { firebaseDb } from './firebase';

export class FirebaseItem {
  constructor(actions, modelClass, path = null) {
    this._actions = actions;
    this._modelClass = modelClass;
    this._path = path;
  }

  get path() {
    return this._path;
  }

  set path(value) {
    this._path = value;
  }

  push(value) {
    return new Promise((resolve, reject) => {
      firebaseDb.ref(this._path)
        .push(value, error => error ? reject(error) : resolve());
    });
  }

  remove(key) {
    return new Promise((resolve, reject) => {
      firebaseDb.ref(`${this._path}`)
        .remove(error => error ? reject(error) : resolve());
    });
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      firebaseDb.ref(`${this._path}`)
        .set(value, error => error ? reject(error) : resolve());
    });
  }

  update(key, value) {
    return new Promise((resolve, reject) => {
      firebaseDb.ref(`${this._path}`)
        .update(value, error => error ? reject(error) : resolve());
    });
  }

  subscribe(emit) {
    let ref = firebaseDb.ref(this._path);
    let initialized = false;

    ref.once('value', (snapshot) => {
      initialized = true;
      let attrs = snapshot.val();
      attrs.key = snapshot.key;
      emit(this._actions.onLoad(new this._modelClass(attrs)));
    }, (error) => {
      console.warn("Firebase once error: " + error)
    });

    ref.on('child_added', snapshot => {
      if (initialized) {
        emit(this._actions.onAdd(this.unwrapSnapshot(snapshot)));
      } else {
        // Do nothing
      }
    });

    ref.on('child_changed', snapshot => {
      emit(this._actions.onChange(this.unwrapSnapshot(snapshot)));
    });

    ref.on('child_removed', snapshot => {
      emit(this._actions.onRemove(this.unwrapSnapshot(snapshot)));
    });

    this._unsubscribe = () => ref.off();
  }

  unsubscribe() {
    this._unsubscribe();
  }

  unwrapSnapshot(snapshot) {
    let attrs = {};
    attrs[snapshot.key] = snapshot.val();
    // attrs.key = snapshot.key;
    return new this._modelClass(attrs);
  }
}
