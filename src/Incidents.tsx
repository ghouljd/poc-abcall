import { useEffect, useState } from "react";
import dayjs from "dayjs";

type Incident = {
  id: number;
  description: string;
  state: string;
  priority: number;
  client: string;
  agent: string;
  creationDate: string;
  updateDate: string;
};

const Incidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const transformDate = (date: string) => {
    return dayjs.unix(parseFloat(date)).format("YYYY-MM-DD");
  };

  useEffect(() => {
    const fetchIncidents = async () => {
      const query = `
        query {
          allIncidents {
            id
            description
            state
            priority
            client
            agent
            creationDate
            updateDate
          }
        }
      `;

      try {
        const response = await fetch(
          "https://graphql-660049252189.us-central1.run.app/graphql",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query,
            }),
          }
        );
        const { data } = await response.json();
        setIncidents(data.allIncidents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Incident List</h3>
      <table>
        <thead>
          <th>ID</th>
          <th>Agent</th>
          <th>Description</th>
          <th>Client</th>
          <th>State</th>
          <th>Priority</th>
          <th>Creation date</th>
          <th>Last Update date</th>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={`incident-${incident.id}`}>
              <td>{incident.id}</td>
              <td>{incident.agent}</td>
              <td>{incident.description}</td>
              <td>{incident.client}</td>
              <td>{incident.state}</td>
              <td>{incident.priority}</td>
              <td>{transformDate(incident.creationDate)}</td>
              <td>{transformDate(incident.updateDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Incidents;
