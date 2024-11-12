interface IEngineQuery {
  query: string;
  variables?: {};
}

interface IUserInfo {
  firstName: string;
  email: string;
  auditRatio: number;
}

const USERINFO_QUERY = `
  query GetTitleData {
  user {
    firstName
    email
    auditRatio
  }
}
`;

export async function fetchUserInfo(): Promise<IUserInfo | Error> {
  const url = 'https://learn.reboot01.com/api/graphql-engine/v1/graphql';
  
  const query: IEngineQuery = {
    query: USERINFO_QUERY,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const result = await response.json();
  

    if (result.data.user && Array.isArray(result.data.user)) {
      const user = result.data.user[0];
      if (user) {
        console.log('Parsed User Info:', user);
        return {
          firstName: user.firstName,
          email: user.email,
          auditRatio: user.auditRatio,
        };
      }
    }

    return new Error('User data not found or malformed response.');

  } catch (error) {
    return new Error(`Failed to fetch user info: ${error instanceof Error ? error.message : error}`);
  }
}
