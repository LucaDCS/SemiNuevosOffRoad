class Model {
    constructor ({name, brand, tipe, hp, cc, weight, width, height, description, descripcion, video}) {
        this.active = true;
        this.name = name;
        this.brand = brand;
		this.tipe = tipe;
        this.hp = hp;
		this.cc = cc;
        this.weight = weight;
        this.width = width;
        this.height = height;
        this.description = description;
        this.descripcion = descripcion;
        this.video = video;
    }
}
module.exports = (Model)