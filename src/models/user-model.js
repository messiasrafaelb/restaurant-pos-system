class User {
    constructor ({id,name,email,password,role,status, created_at}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = status;
        this.created_at = created_at
    }
}

module.exports = User;