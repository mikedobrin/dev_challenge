import { useEffect, useState } from "react";
import { META } from "../../constants";
import { getWorkResultsOverview } from "../../utils";
import './Overview.css';

const MetaData = ({value, refValue}) => {

    const hasSubRows = value instanceof Map;
    const metaData = hasSubRows ? value.get(META) : value;
    let refMetaData;
    if (refValue !== undefined) {
        const refHasSubRows = refValue instanceof Map;
        refMetaData = refHasSubRows ? refValue.get(META) : refValue;
    }

    if (metaData === undefined) {
        return <></>
    }

    return (
        <div className="metadata">
            <div>{metaData.correct}</div>
            <div>{metaData.total}</div> 
            <div>{Math.round(metaData.correct / metaData.total * 100)}%</div>

            {refMetaData !== undefined && <>
                <div>{refMetaData.correct}</div>
                <div>{refMetaData.total}</div>
                <div>{Math.round(refMetaData.correct / refMetaData.total * 100)}%</div>
            </>}
            {refMetaData === undefined && <div className="metadata-noref">no reference data</div> }
        </div>
    )
}

const OverviewRow = ({label, value, refValue, expanded=false}) => {

    const [showSubRows, setShowSubRows] = useState(expanded);

    const toggleShowRows = () => {
        setShowSubRows(!showSubRows);
    }

    const hasSubRows = value instanceof Map;

    const subRows = [];
    if (hasSubRows) {
        value.forEach((subValue, key) => {
            let subRefValue = refValue instanceof Map ? refValue.get(key) : undefined;
            if (key !== META) {
                subRows.push(
                    <OverviewRow label={key} value={subValue} refValue={subRefValue} />
                );
            }
        });
    }

    return (
        <div className="overview-row">
            <div className="overview-row-main">
                <div className="overview-row-main-label-container">
                    {hasSubRows && <div className="overview-row-collapse-expand-sign" onClick={toggleShowRows}>{showSubRows ? "-" : "+"}</div>}
                    <div className="overview-row-main-label">{label}</div>
                </div>
                <MetaData value={value} refValue={refValue} />
            </div>
            {hasSubRows && <div className={`overview-row-subrows ${showSubRows ? "overview-row-subrows-visible" : ""}`}>
                {subRows}
            </div>}
        </div>
    );
}

const Overview = ({workResults, referenceResults}) => {

    const [workResultsOverview, setWorkResultsOverview] = useState();
    const [referenceResultsOverview, setReferenceResultsOverview] = useState();

    useEffect(() => {
        setWorkResultsOverview(getWorkResultsOverview(workResults));
    }, [workResults]);

    useEffect(() => {
        setReferenceResultsOverview(getWorkResultsOverview(referenceResults));
    }, [referenceResults]);

    return (
        <div className="overview">
            {workResults.length === 0 && <div>No data for report period</div>}
            {workResults.length > 0 && <OverviewRow value={workResultsOverview} refValue={referenceResultsOverview} label="Total assignments" expanded={true} />}
        </div>
    )
}

export default Overview;