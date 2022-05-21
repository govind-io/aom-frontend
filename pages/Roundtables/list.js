import { Button, Grid } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import RoundtableCard from "../../Components/Roundtables/RoundtableCard";
import RoundtableCardSkeleton from "../../Components/Roundtables/RoundtableCardSkeleton";
import { GetAllRoundtables } from "../../Redux/Actions/Roundtable";
import { WithAuth } from "../../Utils/ComponentUtilities/WithAuth";

function List() {
  //constants here

  const dispatch = useDispatch();

  //local states here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  //effects here

  useEffect(() => {
    setLoading(true);
    const apidata = {
      onSuccess: (data) => {
        setData(data.allRoundtables);
        setLoading(false);
        setError(false);
      },
      onFailed: (message) => {
        setLoading(false);
        setError(message);
        setData([]);
      },
    };

    dispatch(GetAllRoundtables(apidata));
  }, []);

  //minicomponent here

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item>
          <Link href="/Roundtables/create">
            <Button variant="contained">Create RT</Button>
          </Link>
        </Grid>
      </Grid>
      {loading &&
        [1, 2, 3, 4, 5].map((elem, index) => {
          return <RoundtableCardSkeleton key={index} />;
        })}

      {error && !loading && (
        <Grid container>
          <h1
            style={{
              textAlign: "center",
              fontSize: "34px",
              fontWeight: "bold",
              color: "red",
              width: "100%",
            }}
          >
            {error}
          </h1>
        </Grid>
      )}

      {data.length !== 0 &&
        !loading &&
        !error &&
        data.map((elem) => {
          return <RoundtableCard item={elem} key={elem._id} />;
        })}

      {data.length === 0 && !loading && !error && (
        <Grid container>
          <h1
            style={{
              textAlign: "center",
              fontSize: "34px",
              fontWeight: "bold",
              color: "red",
              width: "100%",
            }}
          >
            No roundtables were found!Be the first one to Create a Roundtable
          </h1>
        </Grid>
      )}
    </>
  );
}

export default WithAuth(List);
