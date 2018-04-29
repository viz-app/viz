import Dexie from 'dexie';

const db = new Dexie('viz_db');

const DELETE_NO_CONFIRMATION = 'delete.no.confirmation';
const DEFAULT_PICTURES_PATH = 'default.pictures.path';

db.version(1).stores({
	prefs: '&key',
	rotation: '[folderPath+fileName]'
});

// initializing default prefs
db.prefs.get({ key: DELETE_NO_CONFIRMATION }).then(value => {
	if (!value) {
		db.prefs.add({ key: DELETE_NO_CONFIRMATION, value: false });
	}
});
db.prefs.get({ key: DEFAULT_PICTURES_PATH }).then(value => {
	if (!value) {
		db.prefs.add({ key: DEFAULT_PICTURES_PATH, value: '' });
	}
});

// user prefs helpers

/**
 * Helper to read a user preference.
 * @param {*} userPrefKey The user preference key (e.g. IndexedDB.DELETE_NO_CONFIRMATION).
 * @returns A promise resolving the user pref value.
 */
const getUserPreference = userPrefKey =>
	db.prefs.get({ key: userPrefKey }).then(pref => pref && pref.value);

/**
 * Helper to write a user preference.
 * @param {*} key The user preference key (e.g. IndexedDB.DELETE_NO_CONFIRMATION)
 * @param {*} value The value we need to set for this preference.
 * @returns A promise resolving when the value is updated.
 */
const setUserPreference = (key, value) => {
	db.prefs.update(key, { value });
};

// Rotation helpers

/**
 * Helper to get the current rotation of an image.
 * @param {*} filePath
 */
const getImageRotation = (folderPath, fileName) =>
	db.rotation.where({ folderPath, fileName }).then(result => result.rotation);
/**
 * Helper to get the rotations of all images of a folder.
 * @param {*} folderPath The abosulte URI of the folder containing the images.
 * @returns An array of image rotations.
 */
const getFolderRotations = folderPath => db.rotation.where({ folderPath });

/**
 * Helper to save an image rotation.
 * @param {*} folderPath The folder containing the image.
 * @param {*} fileName The image name.
 * @param {*} rotation The rotation set by the user.
 */
const setImageRotation = (folderPath, fileName, rotation) => {
	db.prefs.update({ folderPath, fileName }, { folderPath, fileName, rotation });
};

export {
	DELETE_NO_CONFIRMATION,
	DEFAULT_PICTURES_PATH,
	getUserPreference,
	setUserPreference,
	getImageRotation,
	getFolderRotations,
	setImageRotation
};
