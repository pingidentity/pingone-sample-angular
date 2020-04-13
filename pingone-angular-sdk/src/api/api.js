import { Http } from '../core/http';

/**
 * Base client to work with PingOne API
 *
 * @class ApiClient
 */
export class ApiClient {
  constructor(config) {
    this.issuer = `${
      config.AUTH_URI ? config.AUTH_URI : "https://auth.pingone.com"
    }/${config.environmentID}/as`;
    config.issuer = this.issuer;
    this.apiUrl = `${config.API_URI}/v1/environments/${config.environmentID}`;
    this.http = new Http();
  }

  /**
   * Register a new user.
   *
   * @param email
   * @param username
   * @param populationId
   * @returns {*}
   */
  addUser(email, username, populationId) {
    const url = `${this.apiUrl}/users`;

    return this.http.postJson(url, {
      body: {
        email: email,
        username: username,
        population: {
          id: populationId
        }
      },
      headers: {
        "Content-type": "application/json"
      }
    });
  }

  /**
   * Delete user
   * @param userId
   * @returns {Promise<*>}
   */
  deleteUser(userId) {
    const url = `${this.apiUrl}/users/${userId}`;
    return this.http.delete(url, null);
  }

  /**
   * Find user
   * @param userName
   * @returns {*}
   */
  findUser(userName) {
    const url = `${this.apiUrl}/users?filter=email eq "${userName}" or username eq "${userName}"`;
    return this.http.getJson(url, null);
  }

  /**
   * Get all populations
   * @returns {*}
   */
  getPopulations() {
    const url = `${this.apiUrl}/populations`;
    return this.http.getJson(url, null);
  }

  /**
   * Update user attribute values specified in the request body. Attributes omitted from the request body are not updated or removed
   * @function updateUser
   * @param  {string}  userId      - user Id
   * @param {string} firstName     - user's first name
   * @param {string} lastName      - user's last name
   * @returns {Promise} - promise of update endpoint response
   *
   */
  updateUser(userId, firstName, lastName) {
    const url = `${this.apiUrl}/users/${userId}`;
    return this.http.patchJson(url, {
      body: {
        name: {
          given: firstName,
          family: lastName
        }
      }
    });
  }

  /**
   * Change user password
   * @param userId
   * @param currentPassword
   * @param newPassword
   * @returns {*}
   */
  changePassword(userId, currentPassword, newPassword) {
    const url = `${this.apiUrl}/users/${userId}/password`;

    return this.http.putJson(url, {
      body: {
        currentPassword: currentPassword,
        newPassword: newPassword
      },
      headers: {
        "Content-type": "application/vnd.pingidentity.password.reset+json"
      }
    });
  }

  /**
   * Set user password
   * @param userId
   * @param password
   * @param forceChange
   * @returns {*}
   */
  setPassword(userId, password, forceChange = false) {
    const url = `${this.apiUrl}/users/${userId}/password`;

    return this.http.putJson(url, {
      body: {
        value: password,
        forceChange: forceChange
      },
      headers: {
        "Content-type": "application/vnd.pingidentity.password.set+json"
      }
    });
  }

  /**
   * Send recovery code
   * @param userId
   * @returns {*}
   */
  sendRecoveryCode(userId) {
    const url = `${this.apiUrl}/users/${userId}/password`;

    return this.http.postJson(url, {
      headers: {
        "Content-type":
          "application/vnd.pingidentity.password.sendRecoveryCode+json"
      }
    });
  }

  /**
   * Recover user password
   * @param userId
   * @param recoveryCode
   * @param newPassword
   * @returns {*}
   */
  recoverPassword(userId, recoveryCode, newPassword) {
    const url = `${this.apiUrl}/users/${userId}/password`;

    return this.http.postJson(url, {
      body: {
        recoveryCode: recoveryCode,
        newPassword: newPassword
      },
      headers: {
        "Content-type": "application/vnd.pingidentity.password.recover+json"
      }
    });
  }

  /**
   * Get password pattern
   * @returns {PromiseLike<any> | Promise<any>}
   */
  getPasswordPattern() {
    const url = `${this.apiUrl}/passwordPolicies`;
    return this.http.getJson(url, null).then(policies => {
      let passwordPolicies = policies["_embedded"]["passwordPolicies"];
      let defaultPasswordPolicy = passwordPolicies.filter(
        policy =>
          (policy.default === true &&
            policy.minCharacters &&
            policy.maxRepeatedCharacters) ||
          policy.name === "Standard"
      );
      if (defaultPasswordPolicy) {
        let passwordPattern = "^(?:";
        // Construct lookahead assertion for each policy with "minCharacters" group
        let minCharacters = defaultPasswordPolicy[0].minCharacters;
        for (let pattern in minCharacters) {
          // Escape all special for javascript characters
          passwordPattern = `${passwordPattern}(?=(?:.*[${pattern.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}]){${minCharacters[pattern]},})`;
        }
        // Set how many consecutive characters are allowed
        passwordPattern = `${passwordPattern})(?!.*(.)\\1{${defaultPasswordPolicy[0].maxRepeatedCharacters},})`;
        // Set how many characters password should have
        passwordPattern = `${passwordPattern}.{${defaultPasswordPolicy[0].length.min},${defaultPasswordPolicy[0].length.max}}$`;
        return passwordPattern;
      }
    });
  }
}
