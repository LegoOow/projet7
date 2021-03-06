const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.users;
require('dotenv').config();

//Inscription
exports.signup = (req, res, next) => {
    
    // Permet de vérifier que l'utilisateur que l'on souhaite créer n'existe pas déjà
    User.findOne({
        attributes: ['mail'],
        where: {  
            mail: req.body.mail
        }
    })
    .then(userExist => {
        if(!userExist) {
            bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = User.build({
                    username: req.body.username,
                    mail: req.body.mail,
                    password: hash,
                    admin: 0
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Votre compte a bien été créé !' }))
                    .catch(error => res.status(400).json({ error: '⚠ Oops, une erreur s\'est produite !' }));
            })
            .catch(error => res.status(500).json({ error: 'Une erreur s\'est produite lors de la création de votre compte' }));
        } else {
            return res.status(404).json({ error: 'Cet utilisateur existe déjà' })
        }
    })
    .catch(error => res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !' }));
};

exports.login = (req, res, next) => {
    User.findOne({
        where: { mail: req.body.mail }
    })
    .then(user => {
        if(user) {
            console.log(req.body.password)
            console.log(user.password)
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect' });
                }
                res.status(200).json({
                    userId: user.id,
                    admin: user.admin,
                    username: user.username,
                    token: jwt.sign(
                        {userId: user.id},
                        process.env.JWT_SECRET_TOKEN,
                        {expiresIn: '24h'}
                    )
                });
            })
            .catch(error => res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !' }));
        } else {
            return res.status(404).json({ error: 'Cet utilisateur n\'existe pas, veuillez créer un compte' })
        }
    })
    .catch(error => res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !' }));
}

exports.getUserProfile = (req, res, next) => {
    User.findAll({ where: { id: req.params.id }},
        (error, result, rows) => {
            if (error) {
                return res.status(400).json({ error });
            }
            return res.status(200).json(result);
        }
    );
}