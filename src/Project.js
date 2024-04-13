import React, { Component, version } from "react";
import { variables } from "./Variables";
import { Link } from "react-router-dom";
export class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      error: null,
      modalTitle: "",
      name: "",
      id: 0,
      description: "",
      isActive: false,
      createdAt: "",
      updatedAt: "",
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
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
    this.setState({ description: e.target.value });
  };

  changeIsActive = (e) => {
    this.setState({ isActive: e.target.value === "true" });
  };
  changeDate = (e) => {
    this.setState({ updatedAt: e.target.value });
  };

  addClick() {
    this.setState({
      modalTitle: "Add Project",
      id: 0,
      name: "",
      description: "",
    });
  }

  editClick(dep) {
    this.setState({
      modalTitle: "Edit Project",
      id: dep.id,
      name: dep.name,
      description: dep.description,
      isActive: dep.isActive,
      updatedAt: dep.updatedAt,
    });
  }

  updateClick() {
    fetch(`/api/Project/${this.state.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.state.id,
        name: this.state.name,
        description: this.state.description,
        isActive: this.state.isActive,
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
    //2024-04-01T10:25:28.288318

    fetch("/api/Project", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: this.state.name,
        description: this.state.description,
        isActive: this.state.isActive,
        id: (this.state.projects.length + 1).toString(),
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
      error,
      modalTitle,
      name,
      id,
      description,
      isActive,
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
          Add Project
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Description</th>
              <th>Created at</th>
              <th>Updated at</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((dep, index) => (
              <tr
                key={dep.id + index}
                className={dep.isActive ? "" : "table-danger"}
              >
                <td>{index}</td>
                <td>{dep.name}</td>
                <td>{dep.description}</td>
                <td>
                  {dep.createdAt
                    ? dep.createdAt.slice(0, 19).replace("T", " ")
                    : ""}
                </td>
                <td>
                  {dep.updatedAt
                    ? dep.updatedAt.slice(0, 19).replace("T", " ")
                    : ""}
                </td>
                <td>{dep.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-light mr-1"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.editClick(dep)}
                  >
                    Edit
                  </button>
                  {/* Delete button and functionality */}
                </td>
                <td>
                  {dep.isActive?(
                <Link className="btn btn-light btn-outline-primary" to={`/version/${dep.name}`}>
  Versions
</Link>):(
<button className="btn btn-light btn-outline-primary" disabled>
          Versions
        </button>
  )}
                </td>
                <td>
                  {dep.isActive?(
                <Link className="btn btn-light btn-outline-primary" to={`/userproject/${dep.name}`}>
  Users
</Link>):(
<button className="btn btn-light btn-outline-primary" disabled>
          Users
        </button>
  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                  <span className="input-group-text">Name</span>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={this.changeDepartmentName}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Description</span>
                  <input
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={this.changeDepartmentNames}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Status</span>
                  <select
                    className="form-select"
                    value={isActive.toString()}
                    onChange={this.changeIsActive}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                {id == 0 ? (
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
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Project;
