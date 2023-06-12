import { useState } from "react";

// API BUILDING

function generateUniqueId() {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36 string
  const random = Math.random().toString(36).substring(2, 5); // Generate a random string

  return `${timestamp}-${random}`;
}

function singularizeWord(word) {
  const pluralRules = [
    [/s$/i, ""],
    [/(ss)$/i, "$1"],
    [/([^aeiou])ies$/i, "$1y"],
    [/([aeiou]s)$/i, "$1"],
  ];

  for (const [rule, replacement] of pluralRules) {
    if (rule.test(word)) {
      return word.replace(rule, replacement);
    }
  }
  return word;
}

function capitalizeResourceName(str) {
  const words = str.split("_");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join("");
}

export const useAPI = (baseUrl) => {
  const [token, setToken] = useState(null);

  const login = async (username, password) => {
    let res;
    try {
      res = await fetch(`${baseUrl}/api-token-auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
    } catch (error) {
      return false;
    }

    if (!res.ok) {
      return false;
    }
    const { token } = await res.json();

    setToken(token);
    return true;
  };

  const requestEndpoint = async (method, endpoint, body) => {
    console.log("Performing request:", { method, endpoint, body, token });
    const result = await fetch(`${baseUrl}/api/${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body || undefined),
    });

    if (!result.ok) {
      throw Error("Bad response.");
    }

    if (result.status === 204) {
      return {};
    }

    return await result.json();
  };

  const useResource = (resourceName, resourceSchema) => {
    const [storeMap, setStoreMap] = useState(new Map());

    const store = {
      get: (id) => storeMap.get(id),
      set: (id, obj) => {
        setStoreMap(new Map(storeMap.set(id, obj)));
      },
      delete: (id) => {
        storeMap.delete(id);
        setStoreMap(new Map(storeMap));
      },
    };

    const refreshStore = async () => {
      const objs = await requestEndpoint("GET", resourceName);
      objs.forEach((obj) => store.set(obj.id, resourceSchema.toJS(obj)));
    };

    const detailEndpoint = ({ method, optimisticUpdate, rollback, commit }) => {
      return async (newObject) => {
        const oldObject = newObject.id ? store.get(newObject.id) : undefined;
        optimisticUpdate({ oldObject, newObject });
        let serverObj;
        try {
          serverObj = await requestEndpoint(
            method,
            newObject.id ? `${resourceName}/${newObject.id}` : resourceName,
            resourceSchema.toJSON(newObject)
          );
        } catch (error) {
          // TODO: display error
          console.log(error);
          rollback({ oldObject, newObject });
          return;
        }
        commit({
          oldObject,
          newObject,
          serverObject: resourceSchema.toJS(serverObj),
        });
      };
    };

    const createObject = detailEndpoint({
      method: "POST",
      optimisticUpdate: ({ newObject }) => {
        newObject.__temp = generateUniqueId();
        store.set(newObject.__temp, newObject);
      },
      rollback: ({ newObject }) => {
        store.delete(newObject.__temp);
      },
      commit: ({ newObject, serverObject }) => {
        store.set(serverObject.id, serverObject);
        store.delete(newObject.__temp);
      },
    });
    const updateObject = detailEndpoint({
      method: "PATCH",
      optimisticUpdate: ({ newObject }) => {
        store.set(newObject.id, newObject);
      },
      rollback: ({ oldObject }) => {
        store.set(oldObject.id, oldObject);
      },
      commit: ({ serverObject }) => {
        store.set(serverObject.id, serverObject);
      },
    });
    const deleteObject = detailEndpoint({
      method: "DELETE",
      optimisticUpdate: ({ oldObject }) => {
        store.delete(oldObject.id);
      },
      rollback: ({ oldObject }) => {
        store.set(oldObject.id, oldObject);
      },
      commit: () => {}, // noop
    });

    const singular = capitalizeResourceName(singularizeWord(resourceName));

    return {
      [resourceName]: Array.from(storeMap.values()),
      [`refresh${singular}Store`]: refreshStore,
      [`create${singular}`]: createObject,
      [`update${singular}`]: updateObject,
      [`delete${singular}`]: deleteObject,
    };
  };

  return { useResource, login, isLoggedIn: Boolean(token) };
};
