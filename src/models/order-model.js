class Order {
    constructor({id, status, created_at, observations, code}){
        this.id = id;
        this.status = status;
        this.created_at = created_at;
        this.observations = observations;
        this.code = code;
    }
}

module.exports = {
    Order
};