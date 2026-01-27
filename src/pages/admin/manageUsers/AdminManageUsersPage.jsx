import { Container } from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { useFetchAllUsers } from "../../../hooks/adminQueries";
import { useState } from "react";
import ManageUsersTableWrapper from "./ManageUsersTableWrapper";

const AdminManageUsersPage = () => {
  // States
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Queries
  const usersQuery = useFetchAllUsers(pageNumber, pageSize);

  return (
    <Main>
      <Section>
        <Container minW="full">
          <ManageUsersTableWrapper
            query={usersQuery}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </Container>
      </Section>
    </Main>
  );
};

export default AdminManageUsersPage;
