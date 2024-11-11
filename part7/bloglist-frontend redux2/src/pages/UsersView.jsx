import { Table } from "react-bootstrap"
import { Link } from 'react-router-dom'
// import {
//     Container,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//   } from '@mui/material'

const UsersView = ({ users }) => {

  return (
    <div className='table-container'>

      <Table striped>
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th>
              <strong>Users</strong>
            </th>
            <th>
                <strong>blogs created</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => ( 
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>
                {user.blogs.length}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default UsersView



// return (
    //     <div>
    //        <Table striped>
    //          <TableHead>
    //            <TableRow>
    //              <TableCell>
    //              </TableCell>
    //              <TableCell>
    //                  blogs created
    //              </TableCell>
    //            </TableRow>
    //          </TableHead>
    //          <TableBody>
    //            {users.map(user => ( 
    //             <TableRow key={user.id}>
    //               <TableCell>
    //                 {user.username}
    //               </TableCell>
    //               <TableCell>
    //                 {user.blogs.length}
    //               </TableCell>
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //     </div>
    //   )