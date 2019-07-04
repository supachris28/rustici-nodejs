"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const superAgentClientImpl_1 = require("./clients/superAgentClientImpl");
class ClientSdkFactory {
    /**
     * Instantiate implemented client object
     * @param {String} client
     * @param {Object} config
     * @returns {Object}
     */
    constructor(client, config) {
        if (!client)
            throw new Error('client is required');
        if (!config)
            throw new Error('config is required');
        if (client === 'superagent') {
            this.clientImpl = new superAgentClientImpl_1.default(config);
        }
    }
}
exports.default = ClientSdkFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5RUFBa0U7QUFFbEUsTUFBcUIsZ0JBQWdCO0lBT25DOzs7OztPQUtHO0lBQ0gsWUFBWSxNQUFjLEVBQUUsTUFBVztRQUNyQyxJQUFJLENBQUMsTUFBTTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsTUFBTTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUVuRCxJQUFJLE1BQU0sS0FBSyxZQUFZLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLDhCQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQztDQUVGO0FBdEJELG1DQXNCQyJ9