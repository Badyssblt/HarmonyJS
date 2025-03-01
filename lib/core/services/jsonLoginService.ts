import jwt from 'jsonwebtoken';
import LoginType from "../type/LoginType";


class JsonLoginService {

    // Clé secrète pour signer le JWT (doit être stockée dans les variables d'environnement)
    private secretKey: string = process.env.JWT_SECRET || 'default_secret';

    // Durée de validité du token (modifiable selon les besoins)
    private tokenExpiration: string = '1h';


    public login(data: LoginType): string {
        const { email, password } = data;


        // @ts-ignore
        const token = jwt.sign(
            { email },
            this.secretKey,
            { expiresIn: this.tokenExpiration }
        );

        return token;
    }
}

export default JsonLoginService;
