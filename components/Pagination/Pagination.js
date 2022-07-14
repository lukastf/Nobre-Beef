
import { useState } from "react";
import { Pagination } from "react-bootstrap";

export default function P(pages) {

    const [didMount, setDidMount] = useState(false);
    const [page, setPage] = useState(0);

    const [renderPages, setRenderPages] = useState([]);

    const firstPage = () => {

        let val = 0;

        setPage(val);
        pages.get(val);

        funcRenderPages(val);
    }

    const lastPage = () => {

        let val = pages.pages.length - 1;

        setPage(val);
        pages.get(val);

        funcRenderPages(val);
    }

    const nextPage = () => {

        let val = page + 1;

        if (val > pages.pages.length - 1) return;
        setPage(val);
        pages.get(val);

        funcRenderPages(val);
    }

    const prevPage = () => {

        let val = page - 1;

        if (val < 0) return;
        setPage(val);
        pages.get(val);

        funcRenderPages(val);
    }

    const setByVal = (e) => {

        let val = parseInt(e.target.id);
        
        setPage(val);
        pages.get(val);

        funcRenderPages(val);
    }

    const funcRenderPages = (pageIndex) => {

        let p = pages.pages;
        let tempActiveCtrl = [];
        let display = [];

        for (let i = 0; i < p.length; i++) {
            
            tempActiveCtrl.push(false);
            display.push("d-none");
        }

        tempActiveCtrl[pageIndex] = true;

        display[pageIndex-2] = "";
        display[pageIndex-1] = "";
        display[pageIndex] = "";
        display[pageIndex+1] = "";
        display[pageIndex+2] = "";
        //display[pageIndex]
        
        let temp = [];

        if (pageIndex > 2) {

            temp.push(
                <Pagination.Ellipsis key="elipsis1"/>
            );
        }
            
        for (let i = 0; i < p.length; i++) {
            
            temp.push(
            <Pagination.Item 
                key={i}
                onClick={setByVal} id={i} 
                className={display[i]}
                active={tempActiveCtrl[i]}>{i+1}
            </Pagination.Item>);
        }

        if (pageIndex < pages.pages.length - 3) {

            temp.push(
                <Pagination.Ellipsis key="elipsis2" />
            );
        }
            
        setRenderPages(temp);
    }

    if (!didMount) {

        let p = pages.pages;

        if (p.length > 0) {

            setDidMount(true);
            funcRenderPages(0);
        }
    }

    return(
        <Pagination>
            <Pagination.First key="firstPage" onClick={firstPage} />
            <Pagination.Prev key="prevPage" onClick={prevPage}/>
            {/*<Pagination.Item>{1}</Pagination.Item>
            <Pagination.Ellipsis />*/}

            {renderPages}

            {/*<Pagination.Ellipsis />
            <Pagination.Item>{20}</Pagination.Item>*/}
            <Pagination.Next key="nextPage" onClick={nextPage}/>
            <Pagination.Last key="lastPage" onClick={lastPage}/>
        </Pagination>
    )
}