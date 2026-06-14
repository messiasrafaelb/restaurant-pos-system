class User {
    constructor ({id, name, email, password, role, status, created_at}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = status;
        this.created_at = created_at;
    }

    static from(obj = {}){
        return new User({
            id: obj.id,
            name: obj.name,
            email: obj.email,
            password: obj.password,
            role: obj.role || 'USER',
            status: obj.status || 'ATIVO',
            created_at: obj.created_at ?? obj.createdAt ?? new Date()
        });
    }

    static toDbParams(user){
        return [
            user.name,
            user.email,
            user.password,
            user.role,
            user.status
        ];
    }
}

module.exports = { User };