// Incluyo modulo filesystem
const fs = require("fs");

// Declaro clase container
class Container {
  constructor(fileName, data) {
    this.filename = fileName;
    this.items = [...data, "id"];
    this.createFileIfNotExists();
  }

  // Declaro metodo createFileIfNotExists para validar si el archivo existe
  async createFileIfNotExists() {
    try {
      await fs.promises.readFile(this.filename, "utf-8");
    } catch (error) {
      error.code === "ENOENT"
        ? this.createFile()
        : this.printLog("Error when trying to read the file.", error);
    }
  }

  // Declaro metodo para crear el archivo si no existe
  async createFile() {
    fs.writeFile(this.filename, "[]", (error) => {
      error
        ? this.printLog("Error when trying to create the file.", error)
        : this.printLog(`File created.`);
    });
  }

  // Declaro metodo para validar si el item ya existe
  itemExists(item) {
    const objectKeys = Object.keys(item);
    let exists = true;

    objectKeys.forEach((key) => {
      if (!this.items.includes(key)) {
        exists = false;
      }
    });
    return exists;
  }

  // Declaro el metodo getById para obtener detalle de item por Id
  async getById(id) {
    try {
      const jsonData = await this.getData();
      return jsonData.find((item) => item.id === parse.Int(id));
    } catch (error) {
      this.printLog("Error when retrieving item by Id.", error);
    }
  }

  // Declaro el metodo deleteById para borrar un item por Id
  async deleteById(id) {
    try {
      const jsonData = await this.getData();
      const objToRemove = jsonData.find((item) => item.id === parse.Int(id));

      if (objToRemove) {
        const index = jsonData.indexOf(objToRemove);
        jsonData.splice(index, 1);
        await fs.promises.writeFile(
          this.filename,
          JSON.stringify(jsonData, null, 2)
        );
        this.printLog(`The item with Id ${id} was deleted successfully.`);
      } else {
        this.printLog(`The item with Id ${id} does not exist.`);
        return null;
      }
    } catch (error) {
      this.printLog("Error when deleting item by Id.", error);
    }
  }

  // Declaro el metodo updateById para actualizar un item por Id
  async updateById(id, item) {
    if (this.itemExists(item)) {
      try {
        const data = await this.getData();
        const jsonData = JSON.parse(data);
        const objectIdToBeUpdated = jsonData.find(
          (item) => item.id === parse.Int(id)
        );
        if (objectIdToBeUpdated) {
          const index = jsonData.indexOf(objectIdToBeUpdated);

          objectKeys.forEach((key) => {
            jsonData[index][key] = item[key];
          });

          await fs.promises.writeFile(this.filename, JSON.stringify(jsonData));
          return true;
        } else {
          this.printLog(`The item with Id ${id} does not exist.`);
          return null;
        }
      } catch (error) {
        this.printLog(`Error when updating item by Id = ${id}.`, error.code);
      }
    } else {
      return false;
    }
  }

  // Declaro el metodo save para guardar un item
  async save(object) {
    try {
      const jsonData = await this.getData();

      object.id =
        jsonData.length - 1 >= 0 ? jsonData[jsonData.length - 1].id + 1 : 1;

      jsonData.push(object);

      await fs.promises.writeFile(
        this.filename,
        JSON.stringify(jsonData, null, 2)
      );
      this.printLog("Item saved.");
      return object.id;
    } catch (error) {
      this.printLog("Error when saving a item.", error.code);
    }
  }

  // Declaro el metodo deleteAll para eliminar todos los items
  async deleteAll() {
    await fs.writeFile(this.filename, "[]", (error) => {
      error
        ? this.printLog("Error deleting all items.", error)
        : this.printLog(`Items deleted.`);
    });
  }

  // Declaro el metodo getData para obtener el contenido del archivo
  async getData() {
    const data = await fs.promises.readFile(this.filename, "utf-8");
    this.printLog(`Items read from file.`);
    return JSON.parse(data);
  }

  // Declaro el metodo getAll para obtener el detalle de todos los items
  async getAll() {
    const data = await this.getData();
    this.printLog(`All items returned.`);
    return data;
  }

  // Declaro el metodo addToCart para agregar un item al array
  async addToCart(id, newItem) {
    if (this.itemExists(newItem)) {
      try {
        const data = await this.getData();
        const jsonData = JSON.parse(data);
        const itemToUpdate = jsonData.find((item) => item.id === parseInt(id));
        if (itemToUpdate) {
          const index = jsonData.indexOf(itemToUpdate);
          const value = jsonData[index][objectKey];
          const newArray = [...value, newItem[objectKey]];
          jsonData[index][objectKey] = newArray;

          await fs.promises.writeFile(this.filename, JSON.stringify(jsonData));
          return true;
        } else {
          this.printLog(`Item does not exist.`);
          return false;
        }
      } catch (error) {
        this.printLog(`Error updating an item.`, error);
      }
    } else {
      return false;
    }
  }

  // Declaro el metodo removeFromCart para borrar un item del array
  async removeFromCart(id, itemToRemove, keyName) {
    try {
      const data = await this.getData();
      const jsonData = JSON.parse(data);

      const itemToUpdate = jsonData.find((item) => item.id === parseInt(id));

      if (itemToUpdate) {
        const index = jsonData.indexOf(itemToUpdate);

        const value = jsonData[index][keyName];
        let indexToRemove = -1;
        value.forEach((item, indexE) => {
          if (item.id == itemToRemove) {
            indexToRemove = indexE;
          }
        });
        const newArray = [...value];

        if (indexToRemove > -1) {
          newArray.splice(indexToRemove, 1);
        }

        jsonData[index][keyName] = newArray;
        await fs.promises.writeFile(this.filename, JSON.stringify(jsonData));
        return true;
      } else {
        this.printLog(`Item does not exist.`);
        return false;
      }
    } catch (error) {
      this.printLog(`Error updating an item.`, error);
    }
  }

  // Declaro metodo para imprimir mensajes/errores y reducir la cantidad de codigo
  printLog(message, error) {
    console.log(`#-------------------------- LOG --------------------------#`);
    if (message) console.log(`Message: ${message}`);
    if (error) console.log(`Error Code: ${error.code}`);
    console.log(`#---------------------------------------------------------#`);
  }
}

module.exports = Container;
