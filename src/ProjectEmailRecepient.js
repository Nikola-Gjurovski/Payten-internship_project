import React, { Component } from "react";

export class Version extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      version: [],
      error: null,
      modalTitle: "",
      projectId: "",
      id: 0,
      changes: "",
      isActive: true,
      version_type: "",
      createdAt: "",
      updatedAt: "",
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    fetch("/api/Version")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Check each version and update isActive if associated project is inactive
        const updatedVersion = data.map((version) => {
          const associatedProject = this.state.projects.find(
            (project) => project.name === version.projectId
          );
           if (associatedProject && !associatedProject.isActive) {
            version.isActive = false;
            // Update version in the database
            fetch(`/api/Version/${version.id}`, {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: version.id,
                changes: version.changes,
                isActive: false,
                projectId: version.projectId,
                version_type: version.version_type,
                updatedAt: version.updatedAt,
              }),
            })
              .then((res) => res.json())
              .then(
                (result) => {
                  console.log("Version updated:", version.id);
                },
                (error) => {
                  console.error("Update failed:", error);
                }
              );
              }
              else{
                version.isActive = true;
                // Update version in the database
                fetch(`/api/Version/${version.id}`, {
                  method: "PUT",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: version.id,
                    changes: version.changes,
                    isActive: true,
                    projectId: version.projectId,
                    version_type: version.version_type,
                    updatedAt: version.updatedAt,
                  }),
                })
                  .then((res) => res.json())
                  .then(
                    (result) => {
                      console.log("Version updated:", version.id);
                    },
                    (error) => {
                      console.error("Update failed:", error);
                    }
                  );
              }
          return version;
        });
        this.setState({ version: updatedVersion, error: null });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({ error: "Error fetching data" });
      });
    fetch("/api/Project")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ projects: data, error: null });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({ error: "Error fetching data" });
      });
  }

  changeDepartmentName = (e) => {
    this.setState({ name: e.target.value });
  };

  changeid = (e) => {
    this.setState({ id: e.target.value });
  };

  changeDepartmentNames = (e) => {
    this.setState({ changes: e.target.value });
  };
  changeVersion = (e) => {
    this.setState({ version_type: e.target.value });
  };

  changeIsActive = (e) => {
    this.setState({ isActive: e.target.value === "true" });
  };
  changeDepartment = (e) => {
    const selectedProjectId = e.target.value; // get the selected option value
    this.setState({ projectId: selectedProjectId });
  };

  addClick() {
    this.setState({
      modalTitle: "Add Version",
      id: 0,
      name: "",
      changes: "",
      projectId: "",
      version_type: "",
      isActive:true,
    });
  }

  editClick(dep) {
    this.setState({
      modalTitle: "Edit Version",
      id: dep.id,
      version_type: dep.version_type,
      changes: dep.changes,
      isActive: this.state.isActive,
      projectId: dep.projectId,
      updatedAt: dep.updatedAt,
    });
  }

  updateClick() {
    fetch(`/api/Version/${this.state.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.state.id,
        changes: this.state.changes,
        isActive: this.state.isActive,
        projectId: this.state.projectId,
        version_type: this.state.version_type,
        updatedAt: this.state.updatedAt,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.refreshList();
        },
        (error) => {
          console.error("Update failed:", error);
          alert("Failed to update project");
        }
      );
  }

  createClick() {
    const currentDate = new Date().toISOString().slice(0, 19);
    fetch("/api/Version", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        changes: this.state.changes,
        isActive: this.state.isActive,
        projectId: this.state.projectId,
        id: (this.state.version.length + 1).toString(),
        version_type: this.state.version_type,
        createdAt: currentDate,
        updatedAt: null,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.refreshList();
        },
        (error) => {
          alert("Failed");
        }
      );
  }

  render() {
    const {
      projects,
      version,
      error,
      modalTitle,
      name,
      id,
      changes,
      isActive,
      projectId,
      version_type,
      createdAt,
      updatedAt,
    } = this.state;
  
    return (
      <div>
        <button
          type="button"
          className="btn btn-primary m-2 float-end"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => this.addClick()}
        >
          Add Version
        </button>
        {projects.map((project) => (
          <div key={project.id}>
            <h2>{project.name}</h2>
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
                {version
                  .filter((v) => v.projectId === project.name)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((dep, idx) => (
                    <tr key={dep.id} className={idx === 0 ? "" : "table-warning"}>
                      <td>{dep.id}</td>
                      <td>{dep.version_type}</td>
                      <td>{dep.changes}</td>
                      <td>{dep.createdAt ? dep.createdAt.slice(0, 19).replace("T", " ") : ""}</td>
                      <td>{dep.updatedAt ? dep.updatedAt.slice(0, 19).replace("T", " ") : ""}</td>
                      <td>{dep.isActive ? "Active" : "Inactive"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-light mr-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => this.editClick(dep)}
                          disabled={!dep.isActive}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Version type</span>
                  <input
                    type="text"
                    className="form-control"
                    value={version_type}
                    onChange={this.changeVersion}
                  />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Changes</span>
                  <input
                    type="text"
                    className="form-control"
                    value={changes}
                    onChange={this.changeDepartmentNames}
                  />
                </div>

                {id === 0 && ( // Render project dropdown only if id is 0 (indicating adding a new version)
          <div className="input-group mb-3">
            <span className="input-group-text">Project</span>
            <select className="form-select" onChange={this.changeDepartment} value={projectId}>
              <option value="">Select a project</option>
              {projects.map((dep) =>
                dep.isActive ? (
                  <option key={dep.id}>{dep.name}</option>
                ) : null
              )}
            </select>
          </div>
        )}

        {id === 0 ? ( // Render Create button if id is 0 (indicating adding a new version)
          <button type="button" className="btn btn-primary float-start" data-bs-dismiss="modal" onClick={() => this.createClick()}>
            Create
          </button>
        ) : ( // Otherwise, render Update button
          <button type="button" className="btn btn-primary float-start" data-bs-dismiss="modal" onClick={() => this.updateClick()}>
            Update
          </button>
        )}
      
                {/* <div className="input-group mb-3">
                  <span className="input-group-text">Status</span>
                  <select
                    className="form-select"
                    value={isActive.toString()}
                    onChange={this.changeIsActive}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div> */}
                {/* {id == 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    data-bs-dismiss="modal"
                    onClick={() => this.createClick()}
                  >
                    Create
                  </button>
                ) : null}

                {id != 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    data-bs-dismiss="modal"
                    onClick={() => this.updateClick()}
                  >
                    Update
                  </button>
                ) : null} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Version;