import './App.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from './Header'
import ProjectItem from './ProjectItem'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConst = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    projectList: [],
    apiStatus: apiStatusConst.inProgress,
  }

  componentDidMount() {
    this.getProjectDetails()
  }

  getProjectDetails = async () => {
    const {activeCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const option = {
      method: 'GET',
    }

    const response = await fetch(url, option)
    const data = await response.json()

    if (response.ok === true) {
      const formattedData = data.projects.map(eachCategory => ({
        id: eachCategory.id,
        name: eachCategory.name,
        imageUrl: eachCategory.image_url,
      }))

      this.setState({
        projectList: formattedData,
        apiStatus: apiStatusConst.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConst.failure,
      })
    }
  }

  onChangeOption = event => {
    this.setState({activeCategory: event.target.value}, this.getProjectDetails)
  }

  renderLoaderView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p className="">We cannot seem to find the page you are looking for</p>
      <button
        className="retry-button"
        type="button"
        onClick={this.getProjectDetails}
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectList} = this.state
    return (
      <ul className="project-list">
        {projectList.map(eachProject => (
          <ProjectItem key={eachProject.id} projectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderProjectsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConst.inProgress:
        return this.renderLoaderView()

      case apiStatusConst.success:
        return this.renderSuccessView()

      case apiStatusConst.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    const {activeCategory} = this.state
    console.log(activeCategory)

    return (
      <>
        <Header />
        <div className="app-container">
          <select
            value={activeCategory}
            onChange={this.onChangeOption}
            className="select"
          >
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>

          {this.renderProjectsView()}
        </div>
      </>
    )
  }
}

export default App
