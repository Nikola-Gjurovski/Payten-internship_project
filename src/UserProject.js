import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function UserProject() {
  const { projectIdFromParams } = useParams();
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectIdFromParams) {
      // No project ID, clear versions
      setVersions([]);
      return;
    }

    fetch(`/api/EmailRecapient?projectId=${projectIdFromParams}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Filter versions by project ID
        const projectVersions = data.filter((version) => version.project === projectIdFromParams);
        // Sort versions by createdAt timestamp in descending order
        const sortedVersions = projectVersions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setVersions(sortedVersions);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      });
  }, [projectIdFromParams]);

  return (
    <div>
      {error && <p>{error}</p>}
      {projectIdFromParams && (
        <>
          <h2>Project ID: {projectIdFromParams}</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created at</th>
                <th>Updated at</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((version, index) => (
                <tr key={version.id} className={index === 0 ? "table-warning" : ""}>
                  <td>{version.id}</td>
                  <td>{version.description}</td>
                 
                  <td>{version.createdAt ? version.createdAt.slice(0, 19).replace("T", " ") : ""}</td>
                  <td>{version.updatedAt ? version.updatedAt.slice(0, 19).replace("T", " ") : ""}</td>
                  <td>{version.isActive ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default VersionsProject;
