import Realm from 'realm';
import { SHA256 } from './sha';

const UserSchema = {
  name: 'User',
  primaryKey: 'userId',
  properties: {
      userId: 'int',
      userName: 'string',
      userOrgname: {type: 'string', optional: true},
      userEmail: 'string',
      userPass: 'string',
      userWp: {type: 'int', optional: true},
      userTel: {type: 'int', optional: true},
      userIg: {type: 'string', optional: true},
      userFb: {type: 'string', optional: true},
      userTw: {type: 'string', optional: true},
      userPets: 'Pet[]',
  }
}

const PetSchema = {
  name: 'Pet',
  primaryKey: 'petId',
  properties: {
      petId: 'int',
      petName: 'string',
      petType: 'string',
      petAge: 'string',
      petBreed: 'string',
      petLocation: 'string',
      petPicture: 'string',
  }
}

const Schema = [UserSchema, PetSchema];

const databaseOptions = {
  schema: Schema,
  deleteRealmIfMigrationNeeded: true,
}

export const addUser = (name, orgname, email, pass, wp, tel, ig, fb, tw) => new Promise((reject) => {
  Realm.open(databaseOptions).then(realm => {
    const lastUser = realm.objects('User').length + 1;
    let hash = SHA256(pass);
    realm.write(() => {
      realm.create('User', {
          userId: lastUser, 
          userName: name,
          userOrgname: orgname,
          userEmail: email,
          userPass: hash,
          userWp: wp,
          userTel: tel,
          userIg: ig,
          userFb: fb,
          userTw: tw
      });
  });
    console.log(realm.objects('User').length);
    console.log(realm.objects('User'));
    }).catch((error) => reject(error));
});

export const authenticate = (email, pass) => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then(realm => {
    let allUsers = realm.objects('User');
    let hash = SHA256(pass);
    const user = allUsers.filtered(`userEmail='${email}' && userPass ='${hash}'`);
    if (user.length == 0) {
      reject("El usuario no existe");
    }
    resolve(user);
  }).catch((error) => reject(error));
});

export const addPet = (name, type, age, breed, location, picture) => new Promise((reject) => {
  Realm.open(databaseOptions).then(realm => {
    let lastPet = realm.objects('Pet').length + 1;
    realm.write(() => {
      realm.create('Pet', {
          petId: lastPet, 
          petName: name,
          petType: type,
          petAge: age,
          petBreed: breed,
          petLocation: location,
          petPicture: picture,
      });
  });
  console.log(realm.objects('Pet').length);
  console.log(realm.objects('Pet'));
  }).catch((error) => reject(error));
});

export const getPets = () => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then(realm => {
    let allPets = realm.objects('Pet');
    resolve(allPets);
  }).catch((error) => reject(error));
});

export const deletePet = (petId) => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      let pet = realm.objectForPrimaryKey('Pet', petId)
      realm.delete(pet);
      resolve();
    });
  }).catch((error) => reject(error));
});

export const getCats = () => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then(realm => {
    let allPets = realm.objects('Pet');
    let cats = allPets.filtered('petType = "cat"');
    resolve(cats.length);
  }).catch((error) => reject(error));
});

export const getDogs = () => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then(realm => {
    let allPets = realm.objects('Pet');
    let dogs = allPets.filtered('petType = "dog"');
    resolve(dogs.length);
  }).catch((error) => reject(error));
});

export const getOthers = () => new Promise((resolve, reject) => {
  Realm.open(databaseOptions).then(realm => {
    let allPets = realm.objects('Pet');
    let others = allPets.filtered('petType = "other"');
    resolve(others.length);
  }).catch((error) => reject(error));
});

export default new Realm(databaseOptions);
