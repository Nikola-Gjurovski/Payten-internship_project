import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function AllUser() {
  const { projectIdFromParams } = useParams();
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [id, setId] = useState(0);
  const [email, setVersionType] = useState("");
  const [changes, setChanges] = useState("");
  const [project, setProjectId] = useState("");
  const [isCreating, setIsCreating] = useState(true); // Flag to determine if modal is for creating or editing
  const [activeUsers, setActiveUsers] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [inactiveUsers,setInactiveUsers]=useState([]);
  const fetchActiveUsers = () => {
    fetch(`/api/EmailRecepient`)
      .then((response) => response.json())
      .then((data) => {
        const projectVersions = data.filter((version) => version.isActive===true);
        // Sort versions by createdAt timestamp in descending order
        const sortedVersions = projectVersions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setActiveUsers(sortedVersions);
        setError(null);
       
      })
      .catch((error) => {
        console.error("Error fetching active users:", error);
      });
  };
  const fetchInActiveUsers = () => {
    fetch(`/api/EmailRecepient`)
      .then((response) => response.json())
      .then((data) => {
        const projectVersions = data.filter((version) => version.isActive===false);
        // Sort versions by createdAt timestamp in descending order
        const sortedVersions = projectVersions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInactiveUsers(sortedVersions);
        setError(null);
       
      })
      .catch((error) => {
        console.error("Error fetching active users:", error);
      });
  };
  function updateIsActiveStatus(versionId, isActive) {
    fetch(`/api/ProjectEmail/${versionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Optionally, refresh your list here or trigger a re-render
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

  useEffect(() => {
    if (!projectIdFromParams) {
      // No project ID, clear versions
      setVersions([]);
      return;
     }
    fetchActiveUsers();
    fetchInActiveUsers();


    fetch(`/api/ProjectEmail`)
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
        // sortedVersions.forEach(element => {
          
        // });
        setVersions(sortedVersions);
        setError(null);
        sortedVersions.forEach(version => {
          // Check if the version is in the list of inactive users (need fetchInActiveUsers result)
          const isInInactiveUsers = inactiveUsers.some(user => user.email === version.email);
          if (isInInactiveUsers && version.isActive) {
            updateIsActiveStatus(version.id, false);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      });
  }, [projectIdFromParams,inactiveUsers]);


  const addClick = () => {
    setModalTitle("Add User for project");
  
    // Fetch all versions to get the maximum id
    fetch(`/api/ProjectEmail`)
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
        // setChanges("");
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
    setVersionType(dep.email);
    // setChanges(dep.changes);
    setProjectId(dep.project);
    setIsCreating(false);
    setIsActive(dep.isActive);
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
  fetch(`/api/ProjectEmail`)
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
      fetch("/api/ProjectEmail", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          changes: changes,
          isActive: isActive,
          project: projectIdFromParams,
          id: allVersions.length.toString(),
          email: email,
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
    fetch(`/api/ProjectEmail/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        changes: changes,
        isActive: isActive, // Assuming isActive is always true for editing
        project: projectIdFromParams,
        email: email,
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
    fetch(`/api/ProjectEmail`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const projectVersions = data.filter((version) => version.project === projectIdFromParams);
      const sortedVersions = projectVersions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setVersions(sortedVersions);
      setError(null);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    });
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
            Add User for project
          </button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>User</th>
               <th>Joined at</th>
                <th>Status</th>
                <th></th>
                
              </tr>
            </thead>
            <tbody>
              {versions.map((version, index) => {
                const isInInactiveUsers=inactiveUsers.some(user=>user.email===version.email);
                if (isInInactiveUsers) {
                  version.isActive = false;
                }
            
                // Render the row only if the email is not found in the inactive users list
                // or you can choose to always render but with modified properties
                return !isInInactiveUsers ? (
                <tr key={version.id} className={!version.isActive ? "table-danger" : ""}>
                  <td>{version.id}</td>
                  <td>{version.email}</td>
                 
                  <td>{version.createdAt ? version.createdAt.slice(0, 19).replace("T", " ") : ""}</td>
                 
                  <td>{version.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-light mr-1"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => editClick(version)}
                      
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                 

                  </td>
                </tr>
              ):null;
            })}
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
        {/* <div className="input-group mb-3">
          <span className="input-group-text">Email</span>
          <input
            type="text"
            className="form-control"
            value={email}
            onChange={(e) => setVersionType(e.target.value)}
          />
        </div> */}
        <div className="input-group mb-3">
      
  <label className="input-group-text" htmlFor="userDropdown">Users</label>
  
    <select className="form-select" id="userDropdown" value={email} onChange={(e) => setVersionType(e.target.value)}>
    <option value="">Select a user</option>
      {activeUsers .filter((user) => 
      user.isActive && // Ensure the user is active
      !versions.find((version) => version.email == user.email) // Ensure the user is not already part of the project
    )
      .map((user, index) => (
        user.isActive ?
        <option key={index} value={user.email}>{user.email}</option>
        : null
      ))}
    </select>
    
   
</div>
<div className="input-group mb-3">
  <label className="input-group-text" htmlFor="statusDropdown">Status</label>
  <select className="form-select" id="statusDropdown" value={isActive ? "active" : "inactive"} onChange={(e) => setIsActive(e.target.value === "active")}>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</div>

        {/* <div className="input-group mb-3">
          <span className="input-group-text">Changes</span>
          <input
            type="text"
            className="form-control"
            value={changes}
            onChange={(e) => setChanges(e.target.value)}
          />
        </div> */}
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

export default AllUser;