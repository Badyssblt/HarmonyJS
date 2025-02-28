import BaseController from "../../lib/core/BaseController";
import { Route } from '../../lib/decorators/route';  // Le décorateur Route

class UserController {
    @Route('GET', '/user')
    async GetUser()
    {
        return { name: "John Doe" };
    }
}

export default UserController;