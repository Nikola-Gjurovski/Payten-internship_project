import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function VersionsProject() {
  const { projectIdFromParams } = useParams();
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [id, setId] = useState(0);
  const [version_type, setVersionType] = useState("");
  const [changes, setChanges] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isCreating, setIsCreating] = useState(true); // Flag to determine if modal is for creating or editing
  const [activeUsers, setActiveUsers] = useState([]);
  
  // const fetchActiveUsers = () => {
  //   fetch(`/api/ProjectEmail`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const projectVersions = data.filter((version) => version.project === projectIdFromParams && version.isActive===true);
  //       // Sort versions by createdAt timestamp in descending order
  //       const sortedVersions = projectVersions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  //       setActiveUsers(sortedVersions);
  //       setError(null);
       
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching active users:", error);
  //     });
  // };
  const fetchActiveUsers = () => {
    fetch(`/api/EmailRecepient`)
      .then(response => response.json())
      .then(emailRecipients => {
        const activeEmails = new Set(emailRecipients.filter(user => user.isActive).map(user => user.email));
  
        fetch(`/api/ProjectEmail`)
          .then(response => response.json())
          .then(data => {
            const projectVersions = data
              .filter(version => version.project === projectIdFromParams && version.isActive && activeEmails.has(version.email))
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
            setActiveUsers(projectVersions);
            setError(null);
            console.log(projectVersions.email);
          })
          .catch(error => {
            console.error("Error fetching project versions:", error);
          });
      })
      .catch(error => {
        console.error("Error fetching email recipients:", error);
      });
  };
  
  useEffect(() => {
    if (!projectIdFromParams) {
      // No project ID, clear versions
      setVersions([]);
      return;
    }
    fetchActiveUsers();

    fetch(`/api/Version?projectId=${projectIdFromParams}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Filter versions by project ID
        const projectVersions = data.filter((version) => version.projectId === projectIdFromParams);
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


  const addClick = () => {
    setModalTitle("Add Version");
  
    // Fetch all versions to get the maximum id
    fetch(`/api/Version`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Get all versions
        const allVersions = data;
  
        // Calculate the maximum id
        const maxId = allVersions.reduce((max, version) => (version.id > max ? version.id : max), 0);
        console.log(maxId);
  
        // Set the new id
        setId(maxId + 1);
        setVersionType("");
        setChanges("");
        setProjectId(projectIdFromParams);
        setIsCreating(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      });
  };
  
  const editClick = (dep) => {
    setModalTitle("Edit Version");
    setId(dep.id);
    setVersionType(dep.version_type);
    setChanges(dep.changes);
    setProjectId(dep.projectId);
    setIsCreating(false);
  };

  const createOrUpdateClick = () => {
    if (isCreating) {
      createVersion();
    } else {
      updateVersion();
    }
  };

  const createVersion = () => {
    const currentDate = new Date().toISOString().slice(0, 19);
  
  // Fetch all versions to get the maximum id
  fetch(`/api/Version`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Get all versions
      const allVersions = data;

      // Calculate the maximum id
      const maxId = allVersions.reduce((max, version) => (version.id > max ? version.id : max), 0);
      
      // Use the maxId to generate the new id
      fetch("/api/Version", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          changes: changes,
          isActive: true,
          projectId: projectIdFromParams,
          id: allVersions.length.toString(),
          version_type: version_type,
          createdAt: currentDate,
          updatedAt: null,
        }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            refreshList();
          },
          (error) => {
            alert("Failed");
          }
        );
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    });
  };

  const updateVersion = () => {
    fetch(`/api/Version/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        changes: changes,
        isActive: true, // Assuming isActive is always true for editing
        projectId: projectIdFromParams,
        version_type: version_type,
        updatedAt: null, // Update the updatedAt field if necessary
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          refreshList();
        },
        (error) => {
          console.error("Update failed:", error);
          alert("Failed to update project");
        }
      );
  };

  const refreshList = () => {
    // Implement your refresh logic here
    fetch(`/api/Version?projectId=${projectIdFromParams}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const projectVersions = data.filter((version) => version.projectId === projectIdFromParams);
      const sortedVersions = projectVersions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setVersions(sortedVersions);
      setError(null);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    });
  };
  const sendEmail = (versionName, changes) => {
    const recipientEmails = activeUsers.map((user) => user.email).join(", ");
    const subject = "Subject of the email";
    const body = `There is a new version ${versionName} to the project ${projectIdFromParams}. Changes: ${changes}`;
  
    const mailtoLink = `mailto:${recipientEmails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {projectIdFromParams && (
        <>
          <h2>Project ID: {projectIdFromParams}</h2>
          <button
            type="button"
            className="btn btn-primary m-2 float-end"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={addClick}
          >
            Add Version
          </button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Version type</th>
                <th>Changes</th>
                <th>Created at</th>
                <th>Updated at</th>
                <th>Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((version, index) => (
                <tr key={version.id} className={index === 0 ? "table-success" : ""}>
                  <td>{version.id}</td>
                  <td>{version.version_type}</td>
                  <td>{version.changes}</td>
                  <td>{version.createdAt ? version.createdAt.slice(0, 19).replace("T", " ") : ""}</td>
                  <td>{version.updatedAt ? version.updatedAt.slice(0, 19).replace("T", " ") : ""}</td>
                  <td>{version.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-light mr-1"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => editClick(version)}
                      disabled={!version.isActive}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                  <button
  type="button"
  className="btn btn-light mr-1"
  onClick={() => sendEmail(version.version_type, version.changes)}
  
>
  Send Email
</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
  <div className="modal-dialog modal-lg modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{modalTitle}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        {/* Modal content */}
        <div className="input-group mb-3">
          <span className="input-group-text">Version type</span>
          <input
            type="text"
            className="form-control"
            value={version_type}
            onChange={(e) => setVersionType(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Changes</span>
          <textarea
            type="text"
            className="form-control"
            value={changes}
            onChange={(e) => setChanges(e.target.value)}
          />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={createOrUpdateClick}>
          {isCreating ? "Create" : "Update"}
        </button>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}

export default VersionsProject;